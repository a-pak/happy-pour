package com.happypour.happypour.controller;

import org.springframework.web.bind.annotation.RequestMapping;

public class WebController {
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
