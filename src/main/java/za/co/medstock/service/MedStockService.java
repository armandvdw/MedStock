package za.co.medstock.service;

import com.google.gson.Gson;
import spark.Request;
import spark.Response;
import spark.Route;
import za.co.medstock.crud.HibernateUtil;
import za.co.medstock.crud.MedStock;
import za.co.medstock.entities.ChangeLog;
import za.co.medstock.entities.Clinic;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
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

        final MedStockService medServ = new MedStockService();
        final Gson gson = new Gson();
        final MedStock med = new MedStock();
        //this will make all static content available from the frontend, but only files included in this folder
        staticFileLocation("/userinterface");

        if (med.getAllClinics().isEmpty()) {
            Clinic init = new Clinic(1, "Mombaza", "South Africa", 5, 3, 10, -28.0, 27.0);
            med.addNewEntity(init);
        }
        //Serve up the index.html page. Login page
        get("/", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                return medServ.render("/userinterface/pages/index.html", settings);
            }
        });

        //This will serve the main.html page
        get("/home", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                set("title", "MedStock Stock Management ");
                set("count", String.valueOf(settings.size()));
                return medServ.render("/userinterface/pages/home.html", settings);
            }
        });

        get("/reports", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                set("title", "MedStock Stock Management ");
                set("count", String.valueOf(settings.size()));
                return medServ.render("/userinterface/pages/reports.html", settings);
            }
        });

        get("/management", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                set("title", "MedStock Stock Management ");
                set("count", String.valueOf(settings.size()));
                return medServ.render("/userinterface/pages/management.html", settings);
            }
        });

        get("/map", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                set("title", "MedStock Stock Management ");
                set("count", String.valueOf(settings.size()));
                return medServ.render("/userinterface/pages/map.html", settings);
            }
        });

        //Simple Login request
        get("/login", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                if (medServ.authenticate(request.queryParams("username"), request.queryParams("password"))) {
                    response.status(200);
                    return true;
                } else {
                    return false;
                }
            }
        });

        //Gets all the clinics
        get("/clinics/all", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                response.status(200);
                return gson.toJson(med.getAllClinics());
            }
        });

        //Gets only clinics who's stock is less than 5 units
        get("/clinics/lowStock", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                response.status(200);
                gson.toJson(med.getLowStockClinics());
                return gson.toJson(med.getLowStockClinics());
            }
        });

        //Add a clinic object to the database
        post("/clinics/add", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                Clinic clinic = med.mapRequestToClinic(request);
                if (clinic != null) {
                    med.addNewEntity(clinic);
                    response.status(201); // 201 Created
                    return true;
                }
                response.status(500); // Server Error
                return false;
            }
        });

        // Gets the book resource for the provided id
        get("/clinics/:id", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                String id = request.params(":id");
                Clinic clin = med.getClinic(Integer.parseInt(id));
                if (clin != null) {
                    return gson.toJson(clin);
                } else {
                    response.status(404); // 404 Not found
                    return "Clinic has not been found";
                }
            }
        });

        //Gets all the logs
        get("/logs/all", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                response.status(200);
                return gson.toJson(med.getAllLogs());
            }
        });

        // Gets the book resource for the provided id
        get("/logs/:id", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                String id = request.params(":id");
                ArrayList<ChangeLog> log = med.getLogsForClinic(Integer.parseInt(id));
                if (log != null) {
                    return gson.toJson(log);
                } else {
                    response.status(404); // 404 Not found
                    return "No logs for clinic has been found";
                }
            }
        });

        //This will update a clinic based on it's clinicId
        put("/clinics/update", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                String id = request.queryParams("clinicId");
                Clinic serverClinic = med.getClinic(Integer.parseInt(id));
                if (serverClinic != null) {
                    Clinic updatedClinic = med.mapRequestToClinic(request);
                    updatedClinic.setClinicId(Integer.parseInt(id));
                    med.updateEntity(updatedClinic);
                    response.status(200);
                    return "Clinic: " + updatedClinic.getName() + "updated successfully";
                } else {
                    response.status(404); // 404 Not found
                    return "Clinic does not exist";
                }
            }
        });

        //This will remove the clinic from database based on its clinicId
        delete("/clinics/:id", new Route() {
            @Override
            public Object handle(Request request, Response response) {
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
            }
        });
    }

    //This is used to parse the static files being served to the frontend
    public String parseFile(String fileName, String pattern, Map<String, Object> locals) {
        StringBuffer content = new StringBuffer("");
        InputStream is = this.getClass().getResourceAsStream(fileName);
        try {
            BufferedReader buffer = new BufferedReader(new InputStreamReader(is));
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

    //This is part of the parsing of static content processing
    public String layout(String file, String content) {
        HashMap<String, Object> layout = new HashMap<String, Object>();
        layout.put("content", content);
        return parseFile(file, "@\\{(content)\\}", layout);
    }

    //TODO: remove this with proper checking
    public boolean authenticate(String username, String password) {
        return username.equals("demo") && password.equals("test");
    }
}

