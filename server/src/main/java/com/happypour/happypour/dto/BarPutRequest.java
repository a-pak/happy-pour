package com.happypour.happypour.dto;

import com.happypour.happypour.model.Bar;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BarPutRequest {
    private Bar bar;
    private Long userId;
}
