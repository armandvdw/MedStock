package za.co.medstock.crud;

import org.hibernate.Query;
import spark.Request;
import za.co.medstock.entities.ChangeLog;
import za.co.medstock.entities.Clinic;
import za.co.medstock.entities.MedStockUser;

import java.sql.Date;
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
     *
     * @param clinicID The Id of the clinic
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

    public ArrayList<ChangeLog> getAllLogs() {
        HibernateUtil.getCurrentSession().beginTransaction();
        ArrayList<ChangeLog> result = (ArrayList<ChangeLog>) HibernateUtil.getCurrentSession().createCriteria(ChangeLog.class).list();
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return result;
    }

    public ArrayList<ChangeLog> getLogsForClinic(Integer clinicId) {
        HibernateUtil.getCurrentSession().beginTransaction();
        Query q = HibernateUtil.getCurrentSession().createQuery("FROM ChangeLog WHERE clinicId = : clinId");
        q.setParameter("clinId", clinicId);
        ArrayList<ChangeLog> result = (ArrayList<ChangeLog>) q.list();
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return result;
    }

    public MedStockUser getUser(Integer userId) {
        HibernateUtil.getCurrentSession().beginTransaction();
        MedStockUser medStockUser = (MedStockUser) HibernateUtil.getCurrentSession().get(MedStockUser.class, userId);
        HibernateUtil.getCurrentSession().getTransaction().commit();
        return medStockUser;
    }

    /**
     * This is a simple mapper to map the requests to clinic object for further processing in the backend.
     *
     * @param request the request object containing parameters
     * @return A Clinic Object
     */
    public Clinic mapRequestToClinic(Request request) {
        String name = request.queryParams("clinicName");
        String country = request.queryParams("countryName");
        Integer nevirapine = Integer.valueOf(request.queryParams("nevirapineStock"));
        Integer stavudine = Integer.valueOf(request.queryParams("stavudineStock"));
        Integer zidotabine = Integer.valueOf(request.queryParams("zidotabineStock"));
        Double lat = Double.parseDouble(request.queryParams("latitude"));
        Double lon = Double.parseDouble(request.queryParams("longitude"));
        return new Clinic(1, name, country, nevirapine, stavudine, zidotabine, lat, lon);
    }

    public MedStockUser mapRequestToUser(Request request) {
        Integer userId = Integer.valueOf(request.queryParams("userId"));
        String username = request.queryParams("userName");
        String password = request.queryParams("password");
        return new MedStockUser(userId, username, password);
    }

    public void logTransaction(Integer userid, Clinic clin, String message) {
        HibernateUtil.getCurrentSession().beginTransaction();
        Date d = new Date(System.currentTimeMillis());
        HibernateUtil.getCurrentSession().saveOrUpdate(new ChangeLog(0, userid, clin.getClinicId(), d,
                clin.getNevirapineStock(), clin.getStavudineStock(), clin.getZidotabineStock(), message));
        HibernateUtil.getCurrentSession().getTransaction().commit();

    }
}

