import java.io.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by nikoo28 on 4/21/17.
 */
public class PerformanceTableEnhancer {

  public static void main(String[] args) throws IOException {

    String playerTable = "tables/playerTable.csv";
    String performanceTableEnhanced = "tables/performanceTableEnhanced.csv";
    String performanceTable = "tables/performanceTable.csv";

    BufferedReader bufferedReader = new BufferedReader(new FileReader(playerTable));
    String currentLine = null;
    Map<String, String> playerNameTeamMap = new HashMap<>();
    while ((currentLine = bufferedReader.readLine()) != null) {
      String[] splits = currentLine.split(",");
      playerNameTeamMap.put(splits[0], splits[1]);
    }

    FileWriter fileWriter = new FileWriter(performanceTableEnhanced);
    BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

    bufferedReader = new BufferedReader(new FileReader(performanceTable));
    while ((currentLine = bufferedReader.readLine()) != null) {
      String[] splits = currentLine.split(",");
      String playerName = splits[1];
      String playerTeam = playerNameTeamMap.get(playerName);
      bufferedWriter.write(currentLine + "," + playerTeam + "\n");
    }

    bufferedReader.close();
    bufferedWriter.close();

  }

}
