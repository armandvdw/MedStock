package za.co.medstock.service;

import com.google.gson.Gson;
import spark.Request;
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

/**
 * This is my service class that will host the spark service for RESTful operations.
 */
public class MedStockService {

    //Upon starting the service we need to set the hibernate configuration so that we can use the right database.
    public static final String HIBERNATE_CONFIG = "hibernateconf/Hibernate.cfg.xml";
    private static final Map<String, Object> settings = new HashMap<String, Object>();

    //This is used to parse the static files being served to the frontend
    public static String parse(String pattern, String text, Map<String, Object> locals) {
        Matcher regexp = Pattern.compile(pattern).matcher(text);
        while (regexp.find()) {
            text = regexp.replaceFirst(locals.get(regexp.group(1)).toString());
        }
        return text;
    }

    //If we need to set some settings for the static content, we will add them to this set
    public static void set(String key, String value) {
        settings.put(key, value);
    }

    public static void main(String[] args) {
        //Set spark port to listen on.
        setPort(80);
        //Instantiate the Hibernate session that will be used throughout the service life span.
        HibernateUtil.createSessionFactory(HIBERNATE_CONFIG);

        MedStockService medServ = new MedStockService();
        Gson gson = new Gson();
        MedStock med = new MedStock();
        //this will make all static content available from the frontend, but only files included in this folder
        staticFileLocation("/userinterface");

        //Serve up the index.html page. Login page
        get("/", (request, response) -> {
            return medServ.render("userinterface/index.html", settings);
        });

        //This will serve the main.html page
        get("/home", (request, response) -> {
            set("title", "MedStock Stock Management ");
            set("count", String.valueOf(settings.size()));
            return medServ.render("userinterface/main.html", settings);
        });

        //Gets all the clinics
        get("/clinics/all", (request, response) -> {
            response.status(200);
            return medServ.convertToJSON(med.getAllClinics());
        });

        //Gets only clinics who's stock is less than 5 units
        get("/clinics/lowStock", (request, response) -> {
            response.status(200);
            return medServ.convertToJSON(med.getLowStockClinics());
        });

        //Add a clinic object to the database
        post("/clinics/add", (request, response) -> {
            Clinic clinic = medServ.mapRequestToClinic(request);
            if (clinic != null) {
                med.addNewEntity(clinic);
                response.status(201); // 201 Created
                return true;
            }
            response.status(500); // Server Error
            return false;
        });

        // Gets the book resource for the provided id
        get("/clinics/:id", (request, response) -> {
            String id = request.params(":id");
            Clinic clin = med.getClinic(Integer.parseInt(id));
            if (clin != null) {
                return gson.toJson(clin);
            } else {
                response.status(404); // 404 Not found
                return "Clinic has not been found";
            }
        });

        //This will update a clinic based on it's clinicId
        put("/clinics/update", (request, response) -> {
            String id = request.queryParams("clinicId");
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

        //This will remove the clinic from database based on its clinicId
        delete("/clinics/:id", (request, response) -> {
            String id = request.params(":id");
            Clinic clin = med.getClinic(Integer.parseInt(id));
            if (clin != null) {
                med.deleteEntity(clin);
                response.status(200);
                return "Clinic " + clin.getName() + " has been deleted successfully";
            } else {
                response.status(404); // 404 Not found
                return "Clinic does not exist";
            }
        });
    }

    //This is used to parse the static files being served to the frontend
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

    //This will render the static content being served
    public String render(String file, Map<String, Object> locals) {
        return layout(file, this.parseFile(file, "\\$\\{(\\w.*?)\\}", locals));
    }

    /**
     * This will convert a list of clinics to json to send it as a response
     *
     * @param list
     * @return
     */
    public String convertToJSON(ArrayList<Clinic> list) {
        Gson gson = new Gson();
        String response = gson.toJson(list);
        return response;
    }

    //This is part of the parsing of static content processing
    public String layout(String file, String content) {
        HashMap<String, Object> layout = new HashMap<String, Object>();
        layout.put("content", content);
        return parseFile(file, "@\\{(content)\\}", layout);
    }

    /**
     * This is a simple mapper to map the requests to clinic object for further processing in the backend.
     *
     * @param request
     * @return
     */
    public Clinic mapRequestToClinic(Request request) {
        String name = request.queryParams("name");
        String country = request.queryParams("countryId");
        Integer nevirapine = Integer.valueOf(request.queryParams("nevirapineStock"));
        Integer stavudine = Integer.valueOf(request.queryParams("stavudineStock"));
        Integer zidotabine = Integer.valueOf(request.queryParams("zidotabineStock"));
        Double lat = Double.parseDouble(request.queryParams("latitude"));
        Double lon = Double.parseDouble(request.queryParams("longitude"));
        return new Clinic(1, name, country, nevirapine, stavudine, zidotabine, lat, lon);
    }
}

