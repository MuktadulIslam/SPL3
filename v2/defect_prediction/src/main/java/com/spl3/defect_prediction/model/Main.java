package com.spl3.defect_prediction.model;

import org.json.simple.JSONObject;

public class Main {
    public static void main(String[] args) {
        BaseAttributes baseAttributes = new BaseAttributes();
        System.out.println(baseAttributes.toJson());
    }
}
