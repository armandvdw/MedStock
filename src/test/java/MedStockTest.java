import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import za.co.medstock.crud.HibernateUtil;
import za.co.medstock.crud.MedStock;
import za.co.medstock.entities.Clinic;
import za.co.medstock.service.MedStockService;

import java.util.ArrayList;

import static junit.framework.Assert.assertNotNull;
import static org.junit.Assert.assertEquals;

public class MedStockTest {
    public static final String HIBERNATE_CONFIG_TEST = "hibernateconf/HibernateTest.cfg.xml";

    @Before
    public void setUp() {
        HibernateUtil.createSessionFactory(HIBERNATE_CONFIG_TEST);
    }

    @After
    public void closeOff() {
        HibernateUtil.closeSession();
    }

    @Test
    public void testHibernateSave() {
        MedStock m = new MedStock();
        Clinic c = new Clinic(1, "Mobaza", "1", 10, 4, 6, 30.0, 20.1);
        m.addNewEntity(c);
        //Now test to see if it was added
        HibernateUtil.getCurrentSession().beginTransaction();
        Clinic result = (Clinic) HibernateUtil.getCurrentSession().get(Clinic.class, c.getClinicId());
        HibernateUtil.getCurrentSession().getTransaction().commit();
        assertNotNull(result);
        assertEquals("Mobaza", result.getName());
    }

    @Test
    public void testConvertToJSON() {
        MedStock m = new MedStock();
        MedStockService serv = new MedStockService();
        Clinic c1 = new Clinic(1, "Mobaza", "1", 10, 4, 6, 30.0, 20.1);
        Clinic c2  = new Clinic(2,"Zim","2",3,2,1,39.0,21.1);
        m.addNewEntity(c1);
        Assert.assertNotNull(HibernateUtil.getCurrentSession());
        m.addNewEntity(c2);
        ArrayList<Clinic> result = m.getAllClinics();
        Assert.assertNotNull(result);
        String resp = serv.convertToJSON(result);
    }

}
