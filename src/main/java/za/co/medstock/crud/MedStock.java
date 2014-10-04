package za.co.medstock.crud;

import org.hibernate.Query;
import org.hibernate.Session;
import za.co.medstock.entities.Clinic;
import za.co.medstock.entities.Country;
import za.co.medstock.entities.MedUser;

import java.util.ArrayList;


public class MedStock {
    public static final Integer LOW_STOCK_VALUE = 5;
    private Session session;

    public MedStock() {
        session = HibernateUtil.getCurrentSession();
    }

    /**
     * It will never be necessary to get all the users from the database at once seeing as that only one user will be
     * using the service independently. Thus I only have to check if the user exists and if his password matches.
     *
     * @return
     */
    public ArrayList<MedUser> getAllUsers() {
        return (ArrayList<MedUser>) session.createCriteria(MedUser.class).list();
    }

    /**
     * This will get all of the clinics from the database.
     *
     * @return
     */
    public ArrayList<Clinic> getAllClinics() {
        return (ArrayList<Clinic>) session.createCriteria(Clinic.class).list();
    }

    /**
     * This will get all of the countries from the database.
     *
     * @return
     */
    public ArrayList<Country> getAllCountries() {
        return (ArrayList<Country>) session.createCriteria(Country.class).list();
    }

    /**
     * This will add an entity to the database. Hibernate will know by the entity mapping to which table the entity
     * must be added.
     *
     * @param entity
     */
    public void addNewEntity(Object entity) {
        session.beginTransaction();
        session.save(entity);
        session.getTransaction().commit();
    }

    /**
     * This will update and existing entity
     *
     * @param entity
     */
    public void updateEntity(Object entity) {
        session.beginTransaction();
        session.update(entity);
        session.getTransaction().commit();
    }

    /**
     * This will simply delete the specified entity from the database
     *
     * @param entity
     */
    public void deleteEntity(Object entity) {
        session.beginTransaction();
        session.delete(entity);
        session.getTransaction().commit();
    }

    public MedUser getUser(String userID) {
        return (MedUser) session.get(MedUser.class, userID);
    }

    public Clinic getClinic(String clinicID) {
        return (Clinic) session.get(Clinic.class, clinicID);
    }

    public Country getCountry(String countryID) {
        return (Country) session.get(Country.class, countryID);
    }

    /**
     * This will get the Clinics with low stock levels. I would like to use an enum to iterate through all the medication
     * for if the types of medications will increase. I will have to hard code it for now.
     *
     * @return
     */
    public ArrayList<Clinic> getLowStockClinics() {
        Query q = session.createQuery("FROM Clinic WHERE " +
                "nevirapineStock < :lowStock OR " +
                "stavudineStock < :lowStock OR " +
                "zidotabineStock < :lowStock");
        q.setParameter("lowStock", LOW_STOCK_VALUE);
        return (ArrayList<Clinic>) q.list();
    }
}

