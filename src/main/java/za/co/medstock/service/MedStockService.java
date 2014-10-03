package za.co.medstock.service;

import za.co.medstock.crud.HibernateUtil;


public class MedStockService {

    public static final String HIBERNATE_CONFIG = "src/Hibernate.cfg.xml";

    //TODO: this will change when the service is properly done
    public static void main(String [] args){
        // Instantiate the Hibernate session to be used in the service
        HibernateUtil.createSessionFactory(HIBERNATE_CONFIG);
    }
}
