package com.spl3.defect_prediction.model;

import org.json.simple.JSONObject;

public class BaseAttributes {
    public McCabe mccabe;
    public CK ck;
    public Halstead halstead;

    // Constructor
    public BaseAttributes() {
        this.mccabe = new McCabe();
        this.ck = new CK();
        this.halstead = new Halstead();
    }

    public BaseAttributes(McCabe mccabe, CK ck, Halstead halstead) {
        this.mccabe = mccabe;
        this.ck = ck;
        this.halstead = halstead;
    }

    // Getters and Setters for McCabe
    public McCabe getMccabe() {
        return mccabe;
    }

    public void setMccabe(McCabe mccabe) {
        this.mccabe = mccabe;
    }

    // Getters and Setters for CK
    public CK getCk() {
        return ck;
    }

    public void setCk(CK ck) {
        this.ck = ck;
    }

    // Getters and Setters for Halstead
    public Halstead getHalstead() {
        return halstead;
    }

    public void setHalstead(Halstead halstead) {
        this.halstead = halstead;
    }

    // Method to convert all attributes to JSON
    public JSONObject toJson() {
        JSONObject json = new JSONObject();
        json.putAll(mccabe.toJson());
        json.putAll(ck.toJson());
        json.putAll(halstead.toJson());
        return json;
    }
}
