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
    public Integer clinicId;
    public String name;
    public String countryId;
    public Integer nevirapineStock;
    public Integer stavudineStock;
    public Integer zidotabine;
}
