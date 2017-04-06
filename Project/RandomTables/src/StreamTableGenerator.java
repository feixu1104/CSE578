import java.io.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by nikoo28 on 4/6/17.
 */
public class StreamTableGenerator {

  public static void main(String[] args) throws IOException {

    String matchTable = "matchTableHuge.csv";
    String performanceTable = "performanceTableHuge.csv";
    String playerTable = "playerTableHuge.csv";

    BufferedReader bufferedReader = new BufferedReader(new FileReader(matchTable));
    Map<String, String> matchIdDateMap = new HashMap<>();
    String currentLine = null;
    while ((currentLine = bufferedReader.readLine()) != null) {

      String[] split = currentLine.split(",");
      String matchId = split[0];
      String date = split[split.length - 1];

      matchIdDateMap.put(matchId, date);
    }

    bufferedReader = new BufferedReader(new FileReader(playerTable));
    Map<String, String> playerIdplayerName = new HashMap<>();
    Map<String, String> playerIdplayerTeam = new HashMap<>();
    while ((currentLine = bufferedReader.readLine()) != null) {

      String[] split = currentLine.split(",");
      String playerId = split[0];
      String playerName = split[1];
      String playerTeam = split[2];

      playerIdplayerName.put(playerId, playerName);
      playerIdplayerTeam.put(playerId, playerTeam);
    }

    bufferedReader = new BufferedReader(new FileReader(performanceTable));
    String fileName = "streamTable.csv";
    FileWriter fileWriter = new FileWriter(fileName);
    BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
    while ((currentLine = bufferedReader.readLine()) != null) {
      String[] split = currentLine.split(",");

      String matchid = split[0];
      String playerid = split[1];
      String runs = split[2];

      String playerTeam = playerIdplayerTeam.get(playerid);
      String playerName = playerIdplayerName.get(playerid);
      String date = matchIdDateMap.get(matchid);

      if (playerName == null || playerTeam == null || date == null)
        continue;

      bufferedWriter.write(playerName + "," +
          runs + "," +
          date + "," +
          playerTeam + "\n");
    }
    bufferedWriter.close();
    bufferedReader.close();

  }

}
