import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import za.co.medstock.crud.HibernateUtil;
import za.co.medstock.crud.MedStock;
import za.co.medstock.entities.Clinic;

import static junit.framework.Assert.assertNotNull;
import static org.junit.Assert.assertEquals;

public class MedStockTest {
    public static final String HIBERNATE_CONFIG_TEST = "HibernateConf/HibernateTest.cfg.xml";
    @Before
    public void setUp(){
        HibernateUtil.createSessionFactory(HIBERNATE_CONFIG_TEST);
    }
    @After
    public void closeOff(){
        HibernateUtil.closeSession();
    }

    @Test
    public void testHibernateSave(){
        MedStock m = new MedStock();
        Clinic c = new Clinic(1,"Mobaza","1",10,4,6);
        m.addNewEntity(c);
        //Now test to see if it was added
        HibernateUtil.getCurrentSession().beginTransaction();
        Clinic result = (Clinic) HibernateUtil.getCurrentSession().get(Clinic.class,c.getClinicId());
        HibernateUtil.getCurrentSession().getTransaction().commit();
        assertNotNull(result);
        assertEquals("Mobaza", result.getName());
    }

}
