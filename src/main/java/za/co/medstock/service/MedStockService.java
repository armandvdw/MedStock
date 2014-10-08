package za.co.medstock.service;

import com.google.gson.Gson;
import spark.Request;
import spark.Route;
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

import static spark.Spark.*;
import static spark.SparkBase.setPort;
import static spark.SparkBase.staticFileLocation;
import static spark.SparkBase.stop;

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

    public Clinic mapRequestToClinic(Request request){
        String name = request.queryParams("name");
        String country = request.queryParams("country");
        Integer nevirapine =  Integer.valueOf(request.queryParams("nev"));
        Integer stavudine= Integer.valueOf(request.queryParams("sta"));
        Integer zidotabine= Integer.valueOf(request.queryParams("zid"));
        Double lat = Double.parseDouble(request.queryParams("lat"));
        Double lon = Double.parseDouble(request.queryParams("lon"));
        return new Clinic(1,name,country,nevirapine,stavudine,zidotabine,lat,lon);
    }
    public static void main(String[] args) {
        setPort(80);
        HibernateUtil.createSessionFactory(HIBERNATE_CONFIG);
        MedStockService medServ = new MedStockService();
        Gson gson = new Gson();
        MedStock med = new MedStock();

        staticFileLocation("/userinterface");

        //TODO: Remove these set methods.
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
        get("/clinics", (request, response) -> {
            response.status(200);
            return medServ.convertToJSON(med.getAllClinics());
        });
        get("/logout", (request, response) -> {
            HibernateUtil.closeSession();
            stop();
            return "";
        });
        // Creates a new book resource, will return the ID to the created resource
        // author and title are sent as query parameters e.g. /books?author=Foo&title=Bar
        post("/clinic", (request, response) -> {
            Clinic clin = medServ.mapRequestToClinic(request);
            if (clin !=null){
                med.addNewEntity(clin);
                response.status(201); // 201 Created
                return true;
            }

            response.status(500); // Server Error
            return false;
        });

        // Gets the book resource for the provided id
        get("/clinic/:id", (request, response) -> {
            String id =request.params(":id");
            Clinic clin = med.getClinic(Integer.parseInt(id));
            if (clin != null) {
                return gson.toJson(clin);
            } else {
                response.status(404); // 404 Not found
                return "Clinic has not been found";
            }
        });

        // Updates the book resource for the provided id with new information
        // author and title are sent as query parameters e.g. /books/<id>?author=Foo&title=Bar
        put("/clinic/:id", (Route) (request, response) -> {
            String id = request.params(":id");
            //TODO: this step can be removed depending what gets returned by hibernate after entity update ex. returns 1, updated records =  1
            Clinic serverClinic = med.getClinic(Integer.parseInt(id));
            if (serverClinic != null) {
                Clinic updatedClinic = medServ.mapRequestToClinic(request);
                updatedClinic.setClinicId(Integer.parseInt(id));
                med.updateEntity(updatedClinic);
                response.status(200);
                return "Clinic: " + updatedClinic.getName() + "updated successfully";
            } else {
                response.status(404); // 404 Not found
                return "Clinic does not exist";
            }
        });
        // Deletes the book resource for the provided id
        delete("/clinic/:id", (request, response) -> {
            String id = request.params(":id");
            Clinic clin = med.getClinic(Integer.parseInt(id));
            if (clin != null){
                med.deleteEntity(clin);
                response.status(200);
                return "Clinic "+clin.getName()+" has been deleted successfully";
            } else {
                response.status(404); // 404 Not found
                return "Clinic does not exist";
            }
        });
    }
}

