import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

/**
 * Created by nikoo28 on 4/6/17.
 */
public class PerformanceTableGenerator {

  public static final int NUMBER_OF_MATCHES = 1000;
  public static final int NUMBER_OF_PLAYERS = 200;
  public static final int RUNS_RANGE = 150;
  public static final int BALLS_FACED_RANGE = 220;

  // This should not be more than number of matches.
  public static final int ROWS_TO_GENERATE = NUMBER_OF_MATCHES;

  public static void main(String[] args) throws IOException {

    int rows = 0;
    Set<String> matchIDplayerID = new HashSet<>();

    String fileName = "performanceTableHuge.csv";
    FileWriter fileWriter = new FileWriter(fileName);
    BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

    while (rows < ROWS_TO_GENERATE) {

      int matchID = HelperFunctions.randInt(1, NUMBER_OF_MATCHES);
      int playerID = HelperFunctions.randInt(1, NUMBER_OF_PLAYERS);
      String combinedPrimaryKey = Integer.toString(matchID) + "," + Integer.toString(playerID);
      if (matchIDplayerID.contains(combinedPrimaryKey))
        continue;

      matchIDplayerID.add(combinedPrimaryKey);
      StringBuilder generatedRow = new StringBuilder(combinedPrimaryKey);

      int runsScored;
      int ballsFaced;
      do {
        runsScored = HelperFunctions.randInt(1, RUNS_RANGE);
        ballsFaced = HelperFunctions.randInt(1, BALLS_FACED_RANGE);

      } while (Math.abs(runsScored - ballsFaced) > 100);

      generatedRow.append(",");
      generatedRow.append(runsScored);
      generatedRow.append(",");
      generatedRow.append(ballsFaced);
      bufferedWriter.write(generatedRow.toString() + "\n");

      rows++;
    }

    bufferedWriter.close();

  }

}
