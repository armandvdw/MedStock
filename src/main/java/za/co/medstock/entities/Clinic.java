package za.co.medstock.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Clinic implements Serializable {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer clinicId;
    private String clinicName;
    private String countryName;
    private Integer nevirapineStock;
    private Integer stavudineStock;
    private Integer zidotabineStock;
    private Double latitude;
    private Double longitude;
}
