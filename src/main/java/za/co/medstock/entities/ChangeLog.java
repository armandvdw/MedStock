package za.co.medstock.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.io.Serializable;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ChangeLog implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    Integer changeId;
    Integer useId;
    Integer clinicId;
    Timestamp date;
    Integer nevirapine;
    Integer stavudine;
    Integer zidotabine;
    String message;
}
