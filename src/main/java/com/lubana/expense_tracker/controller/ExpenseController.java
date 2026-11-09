package com.lubana.expense_tracker.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.lubana.expense_tracker.model.Expense;
import com.lubana.expense_tracker.repository.ExpenseRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseRepository repository;

    public ExpenseController(ExpenseRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Expense> getAll(@RequestParam(required = false) String month,
                                @RequestParam(required = false) String category) {
        if (month == null) {
            return repository.findAll();
        }
        YearMonth ym = YearMonth.parse(month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        if (category == null || category.isBlank()) {
            return repository.findByExpenseDateBetweenOrderByExpenseDateDesc(start, end);
        }
        return repository.findByExpenseDateBetweenAndCategoryIgnoreCaseOrderByExpenseDateDesc(
                start, end, category);
    }

    @GetMapping("/summary")
    public Map<String, Object> summary(@RequestParam String month) {
        YearMonth ym = YearMonth.parse(month);
        List<Object[]> rows = repository.totalsByCategory(ym.atDay(1), ym.atEndOfMonth());

        Map<String, BigDecimal> byCategory = new LinkedHashMap<>();
        BigDecimal total = BigDecimal.ZERO;
        for (Object[] row : rows) {
            String category = (String) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            byCategory.put(category, sum);
            total = total.add(sum);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("month", month);
        result.put("total", total);
        result.put("byCategory", byCategory);
        return result;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Expense add(@Valid @RequestBody Expense expense) {
        return repository.save(expense);
    }

    @PutMapping("/{id}")
    public Expense update(@PathVariable Long id, @Valid @RequestBody Expense updated) {
        Expense existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));
        existing.setAmount(updated.getAmount());
        existing.setCategory(updated.getCategory());
        existing.setExpenseDate(updated.getExpenseDate());
        existing.setNote(updated.getNote());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found");
        }
        repository.deleteById(id);
    }
}