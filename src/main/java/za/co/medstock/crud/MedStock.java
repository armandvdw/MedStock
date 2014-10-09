package za.co.medstock.crud;

import org.hibernate.Query;
import za.co.medstock.entities.Clinic;

import java.util.ArrayList;

/**
 * This is my database interaction class. Here I specify the queries to the DB.
 */
public class MedStock {
    public static final Integer LOW_STOCK_VALUE = 5;

    public MedStock() {
    }

    /**
     * This will get all of the clinics from the database.
     *
     * @return A list of all clinics
     */
    public ArrayList<Clinic> getAllClinics() {
        HibernateUtil.getCurrentSession().beginTransaction();
        ArrayList<Clinic> result = (ArrayList<Clinic>) HibernateUtil.getCurrentSession().createCriteria(Clinic.class).list();
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return result;
    }

    /**
     * This will add an entity to the database. Hibernate will know by the entity mapping to which table the entity
     * must be added.
     *
     * @param entity That needs to be added
     */
    public void addNewEntity(Object entity) {
        HibernateUtil.getCurrentSession().beginTransaction();
        HibernateUtil.getCurrentSession().save(entity);
        HibernateUtil.getCurrentSession().getTransaction().commit();
    }

    /**
     * This will update and existing entity
     *
     * @param entity that needs to be updated
     */
    public void updateEntity(Object entity) {
        HibernateUtil.getCurrentSession().beginTransaction();
        HibernateUtil.getCurrentSession().update(entity);
        HibernateUtil.getCurrentSession().getTransaction().commit();
    }

    /**
     * This will simply delete the specified entity from the database
     *
     * @param entity That needs to be deleted
     */
    public void deleteEntity(Object entity) {
        HibernateUtil.getCurrentSession().beginTransaction();
        HibernateUtil.getCurrentSession().delete(entity);
        HibernateUtil.getCurrentSession().getTransaction().commit();
    }

    /**
     * Returns a single clinic
     * @param clinicID  The Id of the clinic
     * @return Clinic Object
     */
    public Clinic getClinic(Integer clinicID) {
        HibernateUtil.getCurrentSession().beginTransaction();
        Clinic clinic = (Clinic) HibernateUtil.getCurrentSession().get(Clinic.class, clinicID);
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return clinic;
    }

    /**
     * This will get the Clinics with low stock levels. I would like to use an enum to iterate through all the medication
     * for if the types of medications will increase. I will have to hard code it for now.
     *
     * @return A list of low stock clinics
     */
    public ArrayList<Clinic> getLowStockClinics() {
        HibernateUtil.getCurrentSession().beginTransaction();
        Query q = HibernateUtil.getCurrentSession().createQuery("FROM Clinic WHERE " +
                "nevirapineStock < :lowStock OR " +
                "stavudineStock < :lowStock OR " +
                "zidotabineStock < :lowStock");
        q.setParameter("lowStock", LOW_STOCK_VALUE);
        ArrayList<Clinic> list = (ArrayList<Clinic>) q.list();
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return list;
    }
}

