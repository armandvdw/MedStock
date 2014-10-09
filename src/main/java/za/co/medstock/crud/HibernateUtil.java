package za.co.medstock.crud;

import lombok.NoArgsConstructor;
import org.hibernate.FlushMode;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

@NoArgsConstructor
/**
 * This Class is used to simplify the use of the Hibernate Session and the management of connections throughout the
 * lifespan of the service. It mimics a Singleton pattern by instantiating the class only once, and then be able to use
 * it throughout the entire service.
 */
public class HibernateUtil {

    private static SessionFactory sessionFactory;
    private static ServiceRegistry serviceRegistry;

    /**
     * Creates the Session factory for hibernate
     *
     * @param hibernateConfigFile
     * @return
     */
    public static SessionFactory createSessionFactory(String hibernateConfigFile) {
        Configuration configuration = new Configuration();
        configuration.configure(hibernateConfigFile);
        serviceRegistry = new StandardServiceRegistryBuilder().applySettings(
                configuration.getProperties()).build();
        sessionFactory = configuration.buildSessionFactory(serviceRegistry);
        //Set the session to flush changes in memory to the db when commiting a Transaction.
        sessionFactory.getCurrentSession().setFlushMode(FlushMode.COMMIT);
        return sessionFactory;
    }

    /**
     * Get the session factory for the currentSession.
     *
     * @return
     */
    private static SessionFactory getSessionFactory() {
        if (sessionFactory == null) {
            throw new RuntimeException("Hibernate Session Factory has not been created");
        }
        return sessionFactory;
    }

    /**
     * This will return the current session object from HibernateUtil for CRUD operations and Queries.
     *
     * @return
     */
    public static Session getCurrentSession() {
        return getSessionFactory().getCurrentSession();
    }

    /**
     * This will close down the session.
     */
    public static void closeSession() {
        if (getCurrentSession().isOpen()) {
            getCurrentSession().close();
        }
    }
}
