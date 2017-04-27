import java.io.*;
import java.util.*;

/**
 * Created by nikoo28 on 4/23/17.
 */
public class CStreamTableAggregator {

  public static void main(String[] args) throws IOException {

    Map<String, Map<String, Integer>> yearPlayerRunsMap = new TreeMap<>();

    String streamTable = "tables/filterStreamTables/SriLankaStream.csv";
    BufferedReader bufferedReader = new BufferedReader(new FileReader(streamTable));

    Set<String> playerNames = new HashSet<>();

    String currentLine = null;
    while ((currentLine = bufferedReader.readLine()) != null) {

      String[] splits = currentLine.split(",");
      String year = splits[2];
      String playerName = splits[0];
      playerNames.add(playerName);
      int runs = Integer.parseInt(splits[1]);

      if (yearPlayerRunsMap.containsKey(year)) {

        Map<String, Integer> playerRunsMap = yearPlayerRunsMap.get(year);

        if (playerRunsMap.containsKey(playerName)) {

          Integer playerRuns = playerRunsMap.get(playerName);
          playerRuns += runs;
          playerRunsMap.put(playerName, playerRuns);
          continue;
        }

        playerRunsMap.put(playerName, runs);
        continue;
      }

      Map<String, Integer> playerRunMap = new HashMap<>(1);
      playerRunMap.put(playerName, runs);
      yearPlayerRunsMap.put(year, playerRunMap);
    }

    String aggregatedTable = "tables/aggregatedTables/SriLanka.csv";
    FileWriter fileWriter = new FileWriter(aggregatedTable);
    BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

    List<String> playerNamesList = new ArrayList<>(playerNames);

    bufferedWriter.write("year");
    for (String playerName : playerNamesList) {
      bufferedWriter.write("," + playerName);
    }
    bufferedWriter.write("\n");

    for (Map.Entry<String, Map<String, Integer>> yearPlayerRunMapEntry : yearPlayerRunsMap.entrySet()) {

      String year = yearPlayerRunMapEntry.getKey();
      bufferedWriter.write(year);

      Map<String, Integer> playerNamesAggregatedRuns = new LinkedHashMap<>();
      Map<String, Integer> playerNameRunsMap = yearPlayerRunMapEntry.getValue();

      for (int i = 0; i < playerNamesList.size(); i++) {

        playerNamesAggregatedRuns.put(playerNamesList.get(i), 0);

        for (Map.Entry<String, Integer> playerNameRunEntry : playerNameRunsMap.entrySet()) {
          if (playerNamesList.get(i).equals(playerNameRunEntry.getKey())) {

            playerNamesAggregatedRuns.put(playerNamesList.get(i), playerNameRunEntry.getValue());
          }
        }
      }

      for (int i = 0; i < playerNamesList.size(); i++) {

        bufferedWriter.write("," + playerNamesAggregatedRuns.get(playerNamesList.get(i)));
      }

      bufferedWriter.write("\n");
    }

    bufferedReader.close();
    bufferedWriter.close();
  }

}
