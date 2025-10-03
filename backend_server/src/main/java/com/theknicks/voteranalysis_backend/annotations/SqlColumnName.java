package com.theknicks.voteranalysis_backend.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation to indicate what the appropriate
 * column name is within postgres.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface SqlColumnName {
    public String name() default "";
    public boolean omitFromAggregate() default false;
}
