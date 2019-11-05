package com.SUT.classroom.Controller;

import com.SUT.classroom.Repository.*;
import com.SUT.classroom.Entity.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.catalina.authenticator.SpnegoAuthenticator.AcceptAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParseException;
import org.springframework.web.bind.annotation.*;

import ch.qos.logback.core.joran.conditional.ElseAction;
import io.micrometer.core.instrument.util.MathUtils;

import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLDecoder;
import java.text.DecimalFormat;
import java.util.*;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;
import java.time.*;

//@CrossOrigin(origins = "http://localhost:4200")
//@CrossOrigin(origins = {"https://sutclassroomproject.firebaseapp.com" , "http://localhost:4200"} )
@CrossOrigin
@RestController
public class ScoreController {
    
    @Autowired
    private final ScoreRepository scoreRepository;
    @Autowired
    private final SubjectRepository subjectRepository;
    @Autowired
    private final StudentRepository studentRepository;

    public ScoreController(ScoreRepository scoreRepository,SubjectRepository subjectRepository,StudentRepository studentRepository
            ) {
        this.scoreRepository = scoreRepository;
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
    }
    @GetMapping("/Score")
    public Collection<Score> Score() {
        return scoreRepository.findAll().stream().collect(Collectors.toList());
    }
    @GetMapping("/QLimitScore/{subjectcode}/{typename}")
    public ArrayList<Integer> QLimitScore(@PathVariable String subjectcode,@PathVariable String typename) {
        List<Score> sc = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals(typename)).collect(Collectors.toList());
        return sc.get(0).getLimitScore();
    }

    @GetMapping("/QLimitScoreTime/{subjectcode}/{stdCode}/{typename}/{time}")
    public Integer QLimitScoreTime(@PathVariable String subjectcode,@PathVariable String stdCode,@PathVariable String typename,@PathVariable Integer time) {
        List<Score> sc = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getStudent().getStdCode().equals(stdCode) && s.getScoreType().equals(typename)).collect(Collectors.toList());
        return  sc.get(0).getLimitScore().get(time-1);
    }

    @GetMapping("/QColumn/{subjectcode}/{typescore}")
    public Integer QColumn(@PathVariable String typescore,@PathVariable String subjectcode){
        List<Score> sc = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals(typescore) && s.getNumStudent().equals(1) ).collect(Collectors.toList());
        Score scc  = sc.get(0);
        
        return scc.getLimitScore().size();
    }

    @GetMapping("/CalTotalScore/{subjectcode}")
   // public ArrayList<String> QTotalScore(@PathVariable String subjectcode){

    public ArrayList<Integer> CalTotalScore(@PathVariable String subjectcode){
        ArrayList<Integer> totalScore = new ArrayList<Integer>();

        return totalScore;
    }

    @GetMapping("/QTotalScore/{subjectcode}")
   // public ArrayList<String> QTotalScore(@PathVariable String subjectcode){

    public List<Score> QTotalScore(@PathVariable String subjectcode){
    //public ArrayList<Double> QTotalScore(@PathVariable String subjectcode){

        Score scc  = new Score();
        Subject sj = subjectRepository.findBySubjectCode(subjectcode);

        List<Score> scstd = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals("Score") ).collect(Collectors.toList());
        
        ArrayList<String> test = new ArrayList<String>();

        for(int stdindex = 0;stdindex<scstd.size();stdindex++){
                Score stdall = scstd.get(stdindex);
                List<Score> sccall = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getStudent().getStdCode().equals(stdall.getStudent().getStdCode())).collect(Collectors.toList());
                int indexscore = sccall.size()-1;
                
                ArrayList<Double> totalScore = new ArrayList<Double>();

                double sum =0.00; 

                        for(int type = 0;type<sj.getTypeName().length;type++){
                                String typename = sj.getTypeName()[type];
                                List<Score> scctypelist = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getStudent().getStdCode().equals(stdall.getStudent().getStdCode()) && s.getScoreType().equals(typename)).collect(Collectors.toList());
                                Score scctype = scctypelist.get(0);
                                test.add("stdindex:"+stdindex+" "+scctype.getStudent().getStdCode()+typename);

                                if(scctype.getScoreType().equals("Score")){
                                    indexscore = type;
                                }
                                else{
                                    totalScore.add(scctype.getTotalScore().get(0));
                                    sum = sum + scctype.getTotalScore().get(0);
                                }
                                
                        } 
            
                List<Score> sccallscore = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getStudent().getStdCode().equals(stdall.getStudent().getStdCode()) && s.getScoreType().equals("Score")).collect(Collectors.toList());
                Score sccindexscore = sccallscore.get(0);
                totalScore.add(sum);
                sccindexscore.setTotalScore(totalScore);
                checkGrade(sccindexscore,subjectcode,sum);

                LocalDate currentdate = LocalDate.now();
                sj.setDateScore(currentdate);
                sj.setHaveUpdate(false);
                subjectRepository.save(sj);
                sccindexscore.setSubject(sj);

                scoreRepository.save(sccindexscore);
        }
        List<Score> checkall = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals("Score") ).collect(Collectors.toList());
   //     return test;
                return checkall;
     //       return  totalScore;
    }
    @PostMapping("/UpdateScore/{subjectcode}/{typescore}/{stdCode}/{time}/{real}")
    public Score UpdateScore(@PathVariable String typescore,@PathVariable String stdCode,@PathVariable String subjectcode,@PathVariable Double real,@PathVariable Integer time) {
        List<Score> sc = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals(typescore) && s.getStudent().getStdCode().equals(stdCode)).collect(Collectors.toList());
        Score scc  = sc.get(0);

        Score sccstd  = new Score();
        ArrayList<Double> totalscc = new ArrayList<Double>();

        if(scc.getLimitScore().get(time-1) < real){
            return null;
        }

        Subject sj = subjectRepository.findBySubjectCode(subjectcode);

        ArrayList<Double> RS = scc.getRealScore();
        RS.set(time-1, real);
        scc.setRealScore(RS);

        ArrayList<Integer> missScore = new ArrayList<Integer>();

        int total = 0; 

        for(int i=0; i<scc.getRealScore().size(); i++){
            if(RS.get(i) == 0){
                total = total+1;
            }
        }
        missScore.add(total);
        scc.setMissScore(missScore);

        double caltotal =0.00;
        double calscore =0.00;
        double  calreallimit = 0.00;
        double  reals = 0.00;
        double  limits = 0.00;

        for(int cal = 0; cal<scc.getLimitScore().size();cal++){
            DecimalFormat df = new DecimalFormat("0.0000");
            reals = scc.getRealScore().get(cal);
            limits = scc.getLimitScore().get(cal);
            calreallimit = Double.parseDouble(df.format(reals/limits));
            caltotal = caltotal + calreallimit;
        }

        for(int u =0; u<sj.getTypeScore().length;u++){            
            if(sj.getTypeName()[u].equals(typescore)){
                calscore = (sj.getTypeScore()[u]*caltotal)/(scc.getLimitScore().size());
                BigDecimal bd = new BigDecimal(calscore).setScale(2, RoundingMode.HALF_UP);
                calscore = bd.doubleValue();
            }
        }
        ArrayList<Double> totalScore = new ArrayList<Double>();
        totalScore.add(calscore);
        scc.setTotalScore(totalScore);

        LocalDate currentdate = LocalDate.now();
        sj.setDateScore(currentdate);
        sj.setHaveUpdate(true);
        subjectRepository.save(sj);
        scc.setSubject(sj);

        return scoreRepository.save(scc);
    }


    @PostMapping("/UpdateAll/{subjectcode}/{typescore}/{time}/{real}/{group}")
    public Integer UpdateAll(@PathVariable String typescore,@PathVariable String group,@PathVariable String subjectcode,@PathVariable Double real,@PathVariable Integer time) {
            Score scc  = new Score();

            Subject sj = subjectRepository.findBySubjectCode(subjectcode);
            List<Score> scall ;
            
            if(group.equals("all")){
                scall = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals(typescore)).collect(Collectors.toList());
            }
            else{
                Integer intgroup = Integer.parseInt(group);
                scall = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals(typescore) && s.getNumGroup().equals(intgroup)).collect(Collectors.toList());
            }

            for(int scallt = 0; scallt<scall.size();scallt++){
                scc = scall.get(scallt);
                ArrayList<Double> realScore = new ArrayList<Double>();
                ArrayList<Integer> missScore = new ArrayList<Integer>();

                int total = 0; 

                realScore =  scc.getRealScore();
                realScore.set(time-1,real);
                scc.setRealScore(realScore);

                for(int i=0; i<scc.getRealScore().size(); i++){
                    if(realScore.get(i) == 0){
                        missScore.add(1);
                        total = total+1;
                    }
                    else{
                        missScore.add(0);
                    }
                }
                missScore.add(total);
                scc.setMissScore(missScore);

                double caltotal =0.00;
                double calscore =0.00;
                double  calreallimit = 0.00;
                double  reals = 0.00;
                double  limits = 0.00;

                for(int cal = 0; cal<scc.getLimitScore().size();cal++){
                    DecimalFormat df = new DecimalFormat("0.0000");
                    reals = scc.getRealScore().get(cal);
                    limits = scc.getLimitScore().get(cal);
                    calreallimit = Double.parseDouble(df.format(reals/limits));
                    caltotal = caltotal + calreallimit;
                }
        
                for(int u =0; u<sj.getTypeScore().length;u++){         
                    if(sj.getTypeName()[u].equals(typescore)){
                        calscore = (sj.getTypeScore()[u]*caltotal)/(scc.getLimitScore().size());
                        BigDecimal bd = new BigDecimal(calscore).setScale(2, RoundingMode.HALF_UP);
                        calscore = bd.doubleValue();
                    }
                }
                ArrayList<Double> totalScore = new ArrayList<Double>();
                totalScore.add(calscore);
                scc.setTotalScore(totalScore);

                LocalDate currentdate = LocalDate.now();
                sj.setDateScore(currentdate);
                sj.setHaveUpdate(true);
                subjectRepository.save(sj);
                scc.setSubject(sj);

                scoreRepository.save(scc);

            }

            
            return time;
    }
    @PostMapping("/AddTime/{subjectcode}/{typescore}/{time}/{limit}")
  //  public ArrayList<Integer> AddTime(@PathVariable String typescore,@PathVariable String subjectcode,@PathVariable Integer limit,@PathVariable Integer time) {

    public Integer AddTime(@PathVariable String typescore,@PathVariable String subjectcode,@PathVariable Integer limit,@PathVariable Integer time) {
            Score scc  = new Score();

            Integer real = 0;

            if(limit < real){
                return null;
            }

            Subject sj = subjectRepository.findBySubjectCode(subjectcode);

            List<Score> scall = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals(typescore)).collect(Collectors.toList());
            for(int scallt = 0; scallt<scall.size();scallt++){
                scc = scall.get(scallt);

                ArrayList<Integer> limitscore = new ArrayList<Integer>();
                ArrayList<Double> realScore = new ArrayList<Double>();
                ArrayList<Integer> missScore = new ArrayList<Integer>();

                limitscore = scc.getLimitScore();
                limitscore.add(limit);
                scc.setLimitScore(limitscore);

                realScore = scc.getRealScore();
                realScore.add(0.00);
                scc.setRealScore(realScore);

                Integer total = 0;
                for(int i = 0; i<scc.getRealScore().size(); i++){
                    if(scc.getRealScore().get(i) == 0)
                        total = total+1;
                }
                missScore.add(total);
                scc.setMissScore(missScore);

                //return missScore;

                double caltotal =0.00;
                double calscore =0.00;
                double  calreallimit = 0.00;
                double  reals = 0.00;
                double  limits = 0.00;

                for(int cal = 0; cal<scc.getLimitScore().size();cal++){
                    DecimalFormat df = new DecimalFormat("0.0000");
                    reals = scc.getRealScore().get(cal);
                    limits = scc.getLimitScore().get(cal);
                    calreallimit = Double.parseDouble(df.format(reals/limits));
                    caltotal = caltotal + calreallimit;
                }
        
                for(int u =0; u<sj.getTypeScore().length;u++){         
                    if(sj.getTypeName()[u].equals(typescore)){
                        calscore = (sj.getTypeScore()[u]*caltotal)/(scc.getLimitScore().size());
                        BigDecimal bd = new BigDecimal(calscore).setScale(2, RoundingMode.HALF_UP);
                        calscore = bd.doubleValue();
                    }
                }
                ArrayList<Double> totalScore = new ArrayList<Double>();
                totalScore.add(calscore);
                scc.setTotalScore(totalScore);
          
                LocalDate currentdate = LocalDate.now();
                sj.setDateScore(currentdate);
                sj.setHaveUpdate(true);
                subjectRepository.save(sj);
                scc.setSubject(sj);

                scoreRepository.save(scc);
            }


            return time;
    }

    public void checkGrade(Score scc,String subjectcode,Double totalScore){
        
        int A,Bplus,B,Cplus,C,Dplus,D,F,S;

        Subject sj = subjectRepository.findBySubjectCode(subjectcode);

        if(sj.getModeGrade().equals("A-F")){				

            A = sj.getRangeGrade()[0];
            Bplus = sj.getRangeGrade()[1];
            B = sj.getRangeGrade()[2];
            Cplus = sj.getRangeGrade()[3];
            C = sj.getRangeGrade()[4];
            Dplus = sj.getRangeGrade()[5];
            D = sj.getRangeGrade()[6];
            F = sj.getRangeGrade()[7];	
        
            if(totalScore >= A && totalScore <= 100)
                scc.setGradeScore("A");
            else if(totalScore >= Bplus)
                scc.setGradeScore("B+");
            else if(totalScore >= B)
                scc.setGradeScore("B");
            else if(totalScore >= Cplus)
                scc.setGradeScore("C+");
            else if(totalScore >= C)
                scc.setGradeScore("C");
            else if(totalScore >= Dplus)
                scc.setGradeScore("D+");
            else if(totalScore >= D)
                scc.setGradeScore("D");
            else if(totalScore >= F)
                scc.setGradeScore("F");

        }
        else if(sj.getModeGrade().equals("S-F")){

            S = sj.getRangeGrade()[0];	
            F = sj.getRangeGrade()[1];
            
            if(totalScore >= S && totalScore <= 100)
                scc.setGradeScore("S");
            else if(totalScore >= F)
                scc.setGradeScore("F");
        }
    }

    @GetMapping("/QScore/{subjectcode}/{typescore}")
    public Map<Integer,List<Score>> QScore(@PathVariable String typescore,@PathVariable String subjectcode) {
            
            return scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals(typescore)).collect(Collectors.groupingBy(Score::getNumStudent));
    }

    @GetMapping("/QScoreWithgroup/{subjectcode}/{typescore}/{group}")
    public Map<Integer,List<Score>> QScoreWithgroup(@PathVariable String typescore,@PathVariable String subjectcode,@PathVariable String group) {
            if(group.equals("all")){
                return scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals(typescore)).collect(Collectors.groupingBy(Score::getNumStudent));

            }
            else{
                Integer intgroup = Integer.parseInt(group);
                return scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals(typescore) && s.getNumGroup().equals(intgroup)).collect(Collectors.groupingBy(Score::getNumStudent));

            }

    }

    @GetMapping("/QScoretest/{subjectcode}/{typescore}/{stdCode}")
    public List<List<Score>> QScoretest(@PathVariable String typescore,@PathVariable String subjectcode,@PathVariable String stdCode) {
            Map<Integer,List<Score>> map = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(subjectcode) && s.getScoreType().equals(typescore) && s.getStudent().getStdCode().equals(stdCode)).collect(Collectors.groupingBy(Score::getNumStudent));
            List<List<Score>> allLists = new ArrayList<>(map.values());
            return allLists;
    }

    @PostMapping("/newScore/{subjectCode}/{stdCode}/{numstudent}/{numgroup}/{scoreType}")
        public Score newScore(@PathVariable String subjectCode,@PathVariable String stdCode,@PathVariable Integer numstudent,@PathVariable Integer numgroup,@PathVariable String scoreType) {
                Score sc = new Score();

                sc.setNumStudent(numstudent);
                sc.setNumGroup(numgroup);

                Subject sj = new Subject();
                sj = subjectRepository.findBySubjectCode(subjectCode);
                sc.setSubject(sj);

                Student std = new Student();
                std = studentRepository.findByStdCode(stdCode);
                sc.setStudent(std);

                ArrayList<Integer> limitScore = new ArrayList<Integer>();
                sc.setLimitScore(limitScore);
                ArrayList<Double> realScore = new ArrayList<Double>();
                sc.setRealScore(realScore);
                ArrayList<Integer> missScore = new ArrayList<Integer>();
                sc.setMissScore(missScore);
                ArrayList<Double> totalScore = new ArrayList<Double>();
                totalScore.add(0.00);
                sc.setTotalScore(totalScore);
                sc.setGradeScore("None");
                sc.setScoreType(scoreType);

        return scoreRepository.save(sc);
    }

    @DeleteMapping("/deleteScore/{courseCode}")
    public Map<String, Boolean> deleteStudentregis(@PathVariable String courseCode){
        List<Score> willdelete = scoreRepository.findAll().stream().filter(s -> s.getSubject().getSubjectCode().equals(courseCode)).collect(Collectors.toList());
        for(int i = 0; i< willdelete.size(); i++){            
            scoreRepository.delete(willdelete.get(i));
        }
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
        

    
}
