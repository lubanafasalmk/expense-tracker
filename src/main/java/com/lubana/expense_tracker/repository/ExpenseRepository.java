package com.lubana.expense_tracker.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lubana.expense_tracker.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByExpenseDateBetweenOrderByExpenseDateDesc(LocalDate start, LocalDate end);

    List<Expense> findByExpenseDateBetweenAndCategoryIgnoreCaseOrderByExpenseDateDesc(
            LocalDate start, LocalDate end, String category);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e "
         + "WHERE e.expenseDate BETWEEN :start AND :end GROUP BY e.category")
    List<Object[]> totalsByCategory(@Param("start") LocalDate start, @Param("end") LocalDate end);
}