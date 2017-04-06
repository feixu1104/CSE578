import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by nikoo28 on 4/6/17.
 */
public class MatchTableGenerator {

  public static final String[] teams = {"India", "Australia", "England", "South Africa",
      "Pakistan", "Bangladesh", "Sri Lanka", "West Indies", "Zimbabwe"};
  public static final String RUNS = "runs";
  public static final String WICKETS = "wickets";
  public static final int TEAM_ONE_RANGE = 350;
  public static final int TEAM_TWO_RANGE = 350;
  public static final int WICKET_RANGE = 10;
  public static final int DATE_MIN_VAL = 2006;
  public static final int DATE_MAX_VAL = 2015;
  public static final int NUMBER_OF_MATCHES = 1000;

  // This should not be more than number of matches
  public static final int ROWS_TO_GENERATE = 1000;

  public static void main(String[] args) throws IOException {

    int rows = 0;
    Set<String> matchIDKey = new HashSet<>();

    String fileName = "matchTableHuge.csv";
    FileWriter fileWriter = new FileWriter(fileName);
    BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

    while (rows < ROWS_TO_GENERATE) {

      int matchID = HelperFunctions.randInt(1, NUMBER_OF_MATCHES);
      if (matchIDKey.contains(Integer.toString(matchID)))
        continue;

      matchIDKey.add(Integer.toString(matchID));
      StringBuilder generatedRow = new StringBuilder(Integer.toString(matchID));
      generatedRow.append(",");

      String team1 = teams[HelperFunctions.randInt(0, teams.length - 1)];
      String team2 = teams[HelperFunctions.randInt(0, teams.length - 1)];
      generatedRow.append(team1 + "," + team2 + ",");

      int team1Runs = HelperFunctions.randInt(1, TEAM_ONE_RANGE);
      int team2Runs = HelperFunctions.randInt(1, TEAM_TWO_RANGE);
      generatedRow.append(Integer.toString(team1Runs) + "," + Integer.toString(team2Runs) + ",");

      if (team1Runs > team2Runs) {
        generatedRow.append(RUNS + ",");
        int diff = team1Runs - team2Runs;
        generatedRow.append(Integer.toString(diff) + ",");
        generatedRow.append(team1 + ",");
      } else {
        generatedRow.append(WICKETS + ",");
        generatedRow.append(Integer.toString(HelperFunctions.randInt(1, WICKET_RANGE)) + ",");
        generatedRow.append(team2 + ",");
      }

      generatedRow.append(Integer.toString(HelperFunctions.randInt(1, 12)) + "/" +
          Integer.toString(HelperFunctions.randInt(1, 28)) + "/" +
          Integer.toString(HelperFunctions.randInt(DATE_MIN_VAL, DATE_MAX_VAL)));

      bufferedWriter.write(generatedRow + "\n");
      rows++;
    }

    bufferedWriter.close();

  }

}
