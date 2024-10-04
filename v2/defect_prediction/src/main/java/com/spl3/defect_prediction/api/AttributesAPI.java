package com.spl3.defect_prediction.api;

import com.spl3.defect_prediction.model.BaseAttributes;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AttributesAPI {
    @GetMapping("/get-attributes")
    public JSONObject index() {
        BaseAttributes baseAttributes = new BaseAttributes();
        return baseAttributes.toJson();
    }
}
