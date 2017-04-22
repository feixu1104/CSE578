import java.io.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by nikoo28 on 4/21/17.
 */
public class PerformanceTableEnhancer {

  public static void main(String[] args) throws IOException {

    String matchTable = "tables/matchTable.csv";
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

    bufferedReader = new BufferedReader(new FileReader(matchTable));
    Map<String, String> matchIdWinLose = new HashMap<>();
    Map<String, String> matchIdTeam1 = new HashMap<>();
    Map<String, String> matchIdTeam2 = new HashMap<>();
    while ((currentLine = bufferedReader.readLine()) != null) {
      String[] splits = currentLine.split(",");
      String winner = splits[splits.length - 2];
      String matchId = splits[0];
      String team1 = splits[1];
      String team2 = splits[2];
      matchIdWinLose.put(matchId, winner);
      matchIdTeam1.put(matchId, team1);
      matchIdTeam2.put(matchId, team2);
    }

    FileWriter fileWriter = new FileWriter(performanceTableEnhanced);
    BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

    bufferedReader = new BufferedReader(new FileReader(performanceTable));
    while ((currentLine = bufferedReader.readLine()) != null) {
      String[] splits = currentLine.split(",");
      String matchId = splits[0];
      String playerName = splits[1];
      String playerTeam = playerNameTeamMap.get(playerName);
      String winningTeam = matchIdWinLose.get(matchId);
      String winLose = null;
      String team1 = matchIdTeam1.get(matchId);
      String team2 = matchIdTeam2.get(matchId);
      String playedAgainst;
      if (playerTeam == null || winningTeam == null)
        continue;
      if (playerTeam.equals(winningTeam))
        winLose = "win";
      else
        winLose = "lose";

      if (playerTeam.equals(team1))
        playedAgainst = team2;
      else
        playedAgainst = team1;
      bufferedWriter.write(currentLine + "," + playerTeam + "," + winLose + "," + playedAgainst + "\n");
    }

    bufferedReader.close();
    bufferedWriter.close();

  }

}
