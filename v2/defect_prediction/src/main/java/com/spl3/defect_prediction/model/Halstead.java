package com.spl3.defect_prediction.model;

import org.json.simple.JSONObject;

public class Halstead {
    private double n;                     // Total operators + operands
    private double v;                     // Halstead volume
    private double l;                     // Halstead Program length
    private double d;                     // Halstead Difficulty
    private double i;                     // Halstead Intelligence
    private double e;                     // Halstead Effort
    private double b;                     // Halstead Error Approximation
    private double t;                     // Halstead's Time Estimator
    private double locCode;               // Halstead's Line Count
    private double locComment;            // Count of Lines of Comments
    private double locBlank;              // Count of Blank Lines
    private double locCodeAndComment;     // Code and Comment Line Count
    private double uniqOp;                // Unique Operators
    private double uniqOpnd;              // Unique Operands
    private double totalOp;               // Total Operators
    private double totalOpnd;             // Total Operands

    // Method to convert to JSON
    public JSONObject toJson() {
        JSONObject json = new JSONObject();
        json.put("n", "Halstead Total Operators + Operands");
        json.put("v", "Halstead Volume");
        json.put("l", "Halstead Program Length");
        json.put("d", "Halstead Difficulty");
        json.put("i", "Halstead Intelligence");
        json.put("e", "Halstead Effort");
        json.put("b", "Halstead Error Approximation");
        json.put("t", "Halstead's Time Estimator");
        json.put("locCode", "Halstead's Line Count");
        json.put("locComment", "Count of Lines of Comments");
        json.put("locBlank", "Count of Blank Lines");
        json.put("locCodeAndComment", "Code and Comment Line Count");
        json.put("uniqOp", "Unique Operators");
        json.put("uniqOpnd", "Unique Operands");
        json.put("totalOp", "Total Operators");
        json.put("totalOpnd", "Total Operands");
        return json;
    }

    // Constructor
    public Halstead(){}
    public Halstead(double n, double v, double l, double d, double i, double e, double b, double t,
                    double locCode, double locComment, double locBlank, double locCodeAndComment,
                    double uniqOp, double uniqOpnd, double totalOp, double totalOpnd) {
        this.n = n;
        this.v = v;
        this.l = l;
        this.d = d;
        this.i = i;
        this.e = e;
        this.b = b;
        this.t = t;
        this.locCode = locCode;
        this.locComment = locComment;
        this.locBlank = locBlank;
        this.locCodeAndComment = locCodeAndComment;
        this.uniqOp = uniqOp;
        this.uniqOpnd = uniqOpnd;
        this.totalOp = totalOp;
        this.totalOpnd = totalOpnd;
    }

    // Getters and Setters
    public double getN() { return n; }
    public void setN(double n) { this.n = n; }

    public double getV() { return v; }
    public void setV(double v) { this.v = v; }

    public double getL() { return l; }
    public void setL(double l) { this.l = l; }

    public double getD() { return d; }
    public void setD(double d) { this.d = d; }

    public double getI() { return i; }
    public void setI(double i) { this.i = i; }

    public double getE() { return e; }
    public void setE(double e) { this.e = e; }

    public double getB() { return b; }
    public void setB(double b) { this.b = b; }

    public double getT() { return t; }
    public void setT(double t) { this.t = t; }

    public double getLocCode() { return locCode; }
    public void setLocCode(double locCode) { this.locCode = locCode; }

    public double getLocComment() { return locComment; }
    public void setLocComment(double locComment) { this.locComment = locComment; }

    public double getLocBlank() { return locBlank; }
    public void setLocBlank(double locBlank) { this.locBlank = locBlank; }

    public double getLocCodeAndComment() { return locCodeAndComment; }
    public void setLocCodeAndComment(double locCodeAndComment) { this.locCodeAndComment = locCodeAndComment; }

    public double getUniqOp() { return uniqOp; }
    public void setUniqOp(double uniqOp) { this.uniqOp = uniqOp; }

    public double getUniqOpnd() { return uniqOpnd; }
    public void setUniqOpnd(double uniqOpnd) { this.uniqOpnd = uniqOpnd; }

    public double getTotalOp() { return totalOp; }
    public void setTotalOp(double totalOp) { this.totalOp = totalOp; }

    public double getTotalOpnd() { return totalOpnd; }
    public void setTotalOpnd(double totalOpnd) { this.totalOpnd = totalOpnd; }
}

