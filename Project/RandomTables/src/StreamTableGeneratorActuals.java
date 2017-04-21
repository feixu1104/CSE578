import java.io.*;
import java.util.*;

/**
 * Created by nikoo28 on 4/6/17.
 */
public class StreamTableGeneratorActuals {

  public static void main(String[] args) throws IOException {

    String matchTable = "tables/matchTable.csv";
    String performanceTable = "tables/performanceTable.csv";
    String playerTable = "tables/playerTable.csv";

    BufferedReader bufferedReader = new BufferedReader(new FileReader(matchTable));
    Map<String, String> matchIdDateMap = new HashMap<>();
    Map<String, String> matchIdTeam1 = new HashMap<>();
    Map<String, String> matchIdTeam2 = new HashMap<>();
    String currentLine = null;
    while ((currentLine = bufferedReader.readLine()) != null) {

      String[] split = currentLine.split(",");
      String matchId = split[0];
      String date = split[split.length - 1];
      String team1 = split[1];
      String team2 = split[2];

      matchIdDateMap.put(matchId, date);
      matchIdTeam1.put(matchId, team1);
      matchIdTeam2.put(matchId, team2);
    }

    bufferedReader = new BufferedReader(new FileReader(playerTable));
    Map<String, String> playerNamePlayerTeamMap = new HashMap<>();
    while ((currentLine = bufferedReader.readLine()) != null) {

      String[] split = currentLine.split(",");
      String playerName = split[0];
      String playerTeam = split[1];

      playerNamePlayerTeamMap.put(playerName, playerTeam);
    }

    bufferedReader = new BufferedReader(new FileReader(performanceTable));

    Map<String, BufferedWriter> teamBufferedWriter = new HashMap<>();

    while ((currentLine = bufferedReader.readLine()) != null) {
      String[] split = currentLine.split(",");

      String matchid = split[0];
      String playerName = split[1];
      String runs = split[2];

      String playerTeam = playerNamePlayerTeamMap.get(playerName);
      if (playerTeam == null)
        continue;

      BufferedWriter bufferedWriter = null;
      if (teamBufferedWriter.get(playerTeam) != null) {
        bufferedWriter = teamBufferedWriter.get(playerTeam);
      } else {
        BufferedWriter teamBufferedWriterValue = new BufferedWriter(new FileWriter("actualTables/" + playerTeam + "StreamTable.csv"));
        teamBufferedWriter.put(playerTeam, teamBufferedWriterValue);
      }
      String date = matchIdDateMap.get(matchid);
      String team1 = matchIdTeam1.get(matchid);
      String team2 = matchIdTeam2.get(matchid);
      if (playerName == null || date == null || bufferedWriter == null || team1 == null || team2 == null)
        continue;
      String playedAgainst = team1.equals(playerTeam) ? team2 : team1;


      bufferedWriter.write(playerName + "," +
          runs + "," +
          date.split("-")[0] + "," +
          playerTeam + "," +
          playedAgainst + "\n");
    }

    for (Map.Entry<String, BufferedWriter> stringBufferedWriterEntry : teamBufferedWriter.entrySet()) {
      stringBufferedWriterEntry.getValue().close();
    }
    bufferedReader.close();

  }

}
