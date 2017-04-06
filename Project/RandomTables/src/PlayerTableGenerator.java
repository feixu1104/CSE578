import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

/**
 * Created by nikoo28 on 4/6/17.
 */
public class PlayerTableGenerator {

  public static final int NUMBER_OF_PLAYERS = 200;

  // This should not be more than number of players
  public static final int ROWS_TO_GENERATE = NUMBER_OF_PLAYERS;
  public static final String[] teams = {"India", "Australia", "England", "South Africa",
      "Pakistan", "Bangladesh", "Sri Lanka", "West Indies", "Zimbabwe"};

  public static void main(String[] args) throws IOException {

    int rows = 0;
    Set<String> playerIDplayerName = new HashSet<>();
    List<String> playerName = new ArrayList<>();

    for (int i = 0; i < NUMBER_OF_PLAYERS; i++) {
      playerName.add(HelperFunctions.randomNameGenerator());
    }

    String fileName = "playerTableHuge.csv";
    FileWriter fileWriter = new FileWriter(fileName);
    BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

    while (rows < ROWS_TO_GENERATE) {

      int playerID = HelperFunctions.randInt(1, NUMBER_OF_PLAYERS);
      String player = playerName.get(HelperFunctions.randInt(0, NUMBER_OF_PLAYERS - 1));
      String combinedKey = Integer.toString(playerID) + "," + player;

      if (playerIDplayerName.contains(combinedKey))
        continue;

      playerIDplayerName.add(combinedKey);
      String teamName = teams[HelperFunctions.randInt(0, teams.length - 1)];
      bufferedWriter.write(combinedKey + "," + teamName + "\n");
      rows++;
    }

    bufferedWriter.close();
  }

}
