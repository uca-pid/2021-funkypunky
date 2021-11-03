package com.funkypunky.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.YearMonth;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Setter
public class MetaTotal {
    private YearMonth period;
    private Float progressCalory;
    private Float targetCaloryCount;
}
