package com.theknicks.voteranalysis_backend.helpers;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Optional;

/**
 * NOTE(jerry):
 * I like metaprogramming, since I think it's interesting to write code that generates
 * code (or otherwise automates stuff.)
 *
 * Was quite inspired by the annotations portion of lecture, and might as well write some for once.
 *
 * This provides a relatively slick (at least as best as can be said in Java) way to
 * autogenerate SQL queries.
 */
public class AutoSqlQueryable<T> {
    private final Class<T> _class;

    public AutoSqlQueryable(Class<T> classData) {
        _class = classData;
    }

    private static boolean isOmittedFromSumAggregate(Field field) {
        var columnNameAnnotation = field.getAnnotation(SqlColumnName.class);
        if (columnNameAnnotation == null) {
            return true;
        }

        return (columnNameAnnotation.omitFromAggregate());
    }

    private static Optional<String> getSqlName(Field field) {
        var columnNameAnnotation = field.getAnnotation(SqlColumnName.class);
        if (columnNameAnnotation == null) {
            return Optional.empty();
        }

        if (columnNameAnnotation.name().isEmpty()) {
            return Optional.of(field.getName());
        } else {
            return Optional.of(columnNameAnnotation.name());
        }
    }
    // Happens to be fine for numeric data, might need to evolve as I think
    // more about this
    public String Query(boolean asSumAggregate) {
        var result = new StringBuilder();
        var selfClass = _class;
        var autoSqlAnnotation = selfClass.getAnnotation(AutoSql.class);
        result.append("select\n");
        // For records, which is the use-case this is everything.
        var publicFields = selfClass.getDeclaredFields();
        var fieldsToWrite = new ArrayList<Field>();

        for (int i = 0; i < publicFields.length; ++i) {
            var field = publicFields[i];
            var queryName = getSqlName(field);
            if (queryName.isPresent()) {
                if (asSumAggregate && isOmittedFromSumAggregate(field)) {
                    continue;
                }
                fieldsToWrite.add(field);
            }
        }

        for (int i = 0; i < fieldsToWrite.size(); ++i) {
            var field = fieldsToWrite.get(i);
            var queryName = getSqlName(field);
            if (queryName.isPresent()) {
                if (asSumAggregate) {
                    result.append("sum(");
                }
                result.append(queryName.get());
                if (asSumAggregate) {
                    result.append(")");
                }
                if (i+1 >= fieldsToWrite.size()) {
                    // omit
                } else {
                    result.append(",\n");
                }
            }
        }

        result.append("\nfrom ");
        result.append(autoSqlAnnotation.collection());
        result.append("\n");
        return result.toString();
    }
}