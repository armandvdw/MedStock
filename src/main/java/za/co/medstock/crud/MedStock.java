package za.co.medstock.crud;

import org.hibernate.Query;
import za.co.medstock.entities.Clinic;
import za.co.medstock.entities.Country;
import za.co.medstock.entities.MedUser;

import java.util.ArrayList;


public class MedStock {
    public static final Integer LOW_STOCK_VALUE = 5;

    public MedStock() {
    }

    /**
     * This will get all of the clinics from the database.
     *
     * @return
     */
    public ArrayList<Clinic> getAllClinics() {
        HibernateUtil.getCurrentSession().beginTransaction();
        ArrayList<Clinic> result = (ArrayList<Clinic>) HibernateUtil.getCurrentSession().createCriteria(Clinic.class).list();
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return result;
    }

    /**
     * This will get all of the countries from the database.
     *
     * @return
     */
    public ArrayList<Country> getAllCountries() {
        HibernateUtil.getCurrentSession().beginTransaction();
        ArrayList<Country> list = (ArrayList<Country>) HibernateUtil.getCurrentSession().createCriteria(Country.class).list();
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return list;
    }

    /**
     * This will add an entity to the database. Hibernate will know by the entity mapping to which table the entity
     * must be added.
     *
     * @param entity
     */
    public void addNewEntity(Object entity) {
        HibernateUtil.getCurrentSession().beginTransaction();
        HibernateUtil.getCurrentSession().save(entity);
        HibernateUtil.getCurrentSession().getTransaction().commit();
    }

    /**
     * This will update and existing entity
     *
     * @param entity
     */
    public void updateEntity(Object entity) {
        HibernateUtil.getCurrentSession().beginTransaction();
        HibernateUtil.getCurrentSession().update(entity);
        HibernateUtil.getCurrentSession().getTransaction().commit();
    }

    /**
     * This will simply delete the specified entity from the database
     *
     * @param entity
     */
    public void deleteEntity(Object entity) {
        HibernateUtil.getCurrentSession().beginTransaction();
        HibernateUtil.getCurrentSession().delete(entity);
        HibernateUtil.getCurrentSession().getTransaction().commit();
    }

    public MedUser getUser(String userID) {
        HibernateUtil.getCurrentSession().beginTransaction();
        MedUser user = (MedUser) HibernateUtil.getCurrentSession().get(MedUser.class, userID);
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return user;
    }

    public Clinic getClinic(Integer clinicID) {
        HibernateUtil.getCurrentSession().beginTransaction();
        Clinic clinic = (Clinic) HibernateUtil.getCurrentSession().get(Clinic.class, clinicID);
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return clinic;
    }

    public Country getCountry(String countryID) {
        HibernateUtil.getCurrentSession().beginTransaction();
        Country country = (Country) HibernateUtil.getCurrentSession().get(Country.class, countryID);
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return country;
    }

    /**
     * This will get the Clinics with low stock levels. I would like to use an enum to iterate through all the medication
     * for if the types of medications will increase. I will have to hard code it for now.
     *
     * @return
     */
    public ArrayList<Clinic> getLowStockClinics() {
        HibernateUtil.getCurrentSession().beginTransaction();
        Query q = HibernateUtil.getCurrentSession().createQuery("FROM Clinic WHERE " +
                "nevirapineStock < :lowStock OR " +
                "stavudineStock < :lowStock OR " +
                "zidotabineStock < :lowStock");
        q.setParameter("lowStock", LOW_STOCK_VALUE);
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return (ArrayList<Clinic>) q.list();
    }
}

