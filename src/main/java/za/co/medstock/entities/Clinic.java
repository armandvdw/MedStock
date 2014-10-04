package za.co.medstock.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Clinic {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer clinicId;
    private String name;
    private String countryId;
    private Integer nevirapineStock;
    private Integer stavudineStock;
    private Integer zidotabineStock;
}
