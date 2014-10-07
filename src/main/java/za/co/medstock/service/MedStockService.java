package za.co.medstock.service;

import com.google.gson.Gson;
import org.hibernate.Session;
import za.co.medstock.crud.HibernateUtil;
import za.co.medstock.crud.MedStock;
import za.co.medstock.entities.Clinic;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static spark.Spark.get;
import static spark.SparkBase.*;

public class MedStockService {

    public static final String HIBERNATE_CONFIG = "hibernateconf/Hibernate.cfg.xml";

    private static final Map<String, Object> settings = new HashMap<String, Object>();

    public static String parse(String pattern, String text, Map<String, Object> locals) {
        Matcher regexp = Pattern.compile(pattern).matcher(text);
        while (regexp.find()) {
            text = regexp.replaceFirst(locals.get(regexp.group(1)).toString());
        }
        return text;
    }

    public String parseFile(String fileName, String pattern, Map<String, Object> locals) {
        StringBuffer content = new StringBuffer("");
        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource(fileName).getFile());
        try {
            BufferedReader buffer = new BufferedReader(new FileReader(file));
            String line = null;

            while ((line = buffer.readLine()) != null) {
                content.append(parse(pattern, line, locals) + "\n");
            }

            buffer.close();
        } catch (Exception exception) {
            System.out.printf("ERROR: %s\n", exception.getMessage());
        } finally {
            return content.toString();
        }
    }

    public String render(String file, Map<String, Object> locals) {
        return layout(file, this.parseFile(file, "\\$\\{(\\w.*?)\\}", locals));
    }

    public String convertToJSON(ArrayList<Clinic> list){
        Gson gson = new Gson();
        String response =  gson.toJson(list);
        return response;
    }

    public String layout(String file, String content) {
        HashMap<String, Object> layout = new HashMap<String, Object>();
        layout.put("content", content);
        return parseFile(file, "@\\{(content)\\}", layout);
    }

    public static void set(String key, String value) {
        settings.put(key, value);
    }

    public static void main(String[] args) {
        setPort(80);
        HibernateUtil.createSessionFactory(HIBERNATE_CONFIG);
        MedStockService medServ = new MedStockService();
        Session session = HibernateUtil.getCurrentSession();
        MedStock med = new MedStock();

        staticFileLocation("/userinterface");

        get("/hello", (request, response) -> {
            return "Hello World!";
        });

        get("/", (request, response) -> {
            set("title", "MedStock Stock Management ");
            set("count", String.valueOf(settings.size()));
            return medServ.render("userinterface/index.html", settings);
        });
        get("/home", (request, response) -> {
            set("title", "MedStock Stock Management ");
            set("count", String.valueOf(settings.size()));
            return medServ.render("userinterface/main.html", settings);
        });
        get("/clinicData", (request, response) -> {
            ArrayList<Clinic> list = med.getAllClinics();
            return medServ.convertToJSON(med.getAllClinics());
        });
        get("/logout", (request, response) -> {
            HibernateUtil.closeSession();
            stop();
            return "";
        });
    }
}

