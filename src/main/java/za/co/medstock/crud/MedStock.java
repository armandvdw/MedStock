package za.co.medstock.crud;

import org.hibernate.Session;
import za.co.medstock.entities.Clinic;
import za.co.medstock.entities.Country;
import za.co.medstock.entities.User;

import java.util.ArrayList;


public class MedStock {
    public Session session;

    public MedStock() {
        session = HibernateUtil.getCurrentSession();
    }

    /**
     * It will never be necessary to get all the users from the database at once seeing as that only one user will be
     * using the service independently. Thus I only have to check if the user exists and if his password matches.
     *
     * @return
     */
    public ArrayList<User> getAllUsers() {
        return (ArrayList<User>) session.createCriteria(User.class).list();
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

    public User getUser(String userID) {
        return (User) session.get(User.class, userID);
    }

    public Clinic getClinic(String clinicID) {
        return (Clinic) session.get(Clinic.class, clinicID);
    }

    public Country getCountry(String countryID) {
        return (Country) session.get(Country.class, countryID);
    }
}

