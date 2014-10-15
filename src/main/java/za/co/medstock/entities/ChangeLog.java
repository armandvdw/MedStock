package za.co.medstock.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.joda.time.DateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.io.Serializable;

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
    DateTime date;
    Integer nevirapine;
    Integer stavudine;
    Integer zidotabine;
}
