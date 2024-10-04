package com.spl3.defect_prediction.model2;

public class MetricData {

    private int woc; // Weight of Method Count
    private int dit; // Depth of Inheritance Tree
    private int noc; // Number of Children
    private int cbo; // Coupling Between Object
    private int rfc; // Response for Class
    private int lcom; // Lack of Cohesion in Methods
    private int ca; // Afferent Coupling
    private int ce; // Efferent Coupling
    private int nom; // Number of Public Methods
    private int lcom3; // Lack of Cohesion in Methods (variant 3)
    private int loc; // Lines of Code
    private int dam; // Data Access Metrics
    private int moa; // Measure of Aggression
    private int mfa; // Measures of Functional Abstraction
    private int cam; // Cohesion Among Methods of Class
    private int ic; // Inheritance Coupling
    private int cbm; // Coupling Between Methods
    private double amc; // Average Method Complexity
    private int maxCc; // Maximum Cyclomatic Complexity
    private double avgCc; // Average Cyclomatic Complexity
    private boolean bug; // true/false

    public MetricData(double amc, double avgCc, int ca, int woc, int cam, int cbm, int cbo, int ce, int dam, int dit, int ic, int lcom3, int lcom, int loc, int maxCc, int mfa, int moa, int noc, int nom, int rfc, boolean bug) {
        this.amc = amc;
        this.avgCc = avgCc;
        this.ca = ca;
        this.bug = bug;
        this.cam = cam;
        this.cbm = cbm;
        this.cbo = cbo;
        this.ce = ce;
        this.dam = dam;
        this.dit = dit;
        this.ic = ic;
        this.lcom3 = lcom3;
        this.lcom = lcom;
        this.loc = loc;
        this.maxCc = maxCc;
        this.mfa = mfa;
        this.moa = moa;
        this.noc = noc;
        this.nom = nom;
        this.rfc = rfc;
        this.woc = woc;
    }

    public int getLcom3() {
        return lcom3;
    }

    public void setLcom3(int lcom3) {
        this.lcom3 = lcom3;
    }

    public double getAmc() {
        return amc;
    }

    public void setAmc(double amc) {
        this.amc = amc;
    }

    public double getAvgCc() {
        return avgCc;
    }

    public void setAvgCc(double avgCc) {
        this.avgCc = avgCc;
    }

    public int getCa() {
        return ca;
    }

    public void setCa(int ca) {
        this.ca = ca;
    }

    public boolean isBug() {
        return bug;
    }

    public void setBug(boolean bug) {
        this.bug = bug;
    }

    public int getCam() {
        return cam;
    }

    public void setCam(int cam) {
        this.cam = cam;
    }

    public int getCbm() {
        return cbm;
    }

    public void setCbm(int cbm) {
        this.cbm = cbm;
    }

    public int getCbo() {
        return cbo;
    }

    public void setCbo(int cbo) {
        this.cbo = cbo;
    }

    public int getCe() {
        return ce;
    }

    public void setCe(int ce) {
        this.ce = ce;
    }

    public int getDam() {
        return dam;
    }

    public void setDam(int dam) {
        this.dam = dam;
    }

    public int getDit() {
        return dit;
    }

    public void setDit(int dit) {
        this.dit = dit;
    }

    public int getIc() {
        return ic;
    }

    public void setIc(int ic) {
        this.ic = ic;
    }

    public int getLcom() {
        return lcom;
    }

    public void setLcom(int lcom) {
        this.lcom = lcom;
    }

    public int getLoc() {
        return loc;
    }

    public void setLoc(int loc) {
        this.loc = loc;
    }

    public int getMaxCc() {
        return maxCc;
    }

    public void setMaxCc(int maxCc) {
        this.maxCc = maxCc;
    }

    public int getMfa() {
        return mfa;
    }

    public void setMfa(int mfa) {
        this.mfa = mfa;
    }

    public int getMoa() {
        return moa;
    }

    public void setMoa(int moa) {
        this.moa = moa;
    }

    public int getNoc() {
        return noc;
    }

    public void setNoc(int noc) {
        this.noc = noc;
    }

    public int getNom() {
        return nom;
    }

    public void setNom(int nom) {
        this.nom = nom;
    }

    public int getRfc() {
        return rfc;
    }

    public void setRfc(int rfc) {
        this.rfc = rfc;
    }

    public int getWoc() {
        return woc;
    }

    public void setWoc(int woc) {
        this.woc = woc;
    }
}
