import java.io.*;
import java.util.*;

/**
 * Created by nikoo28 on 4/21/17.
 */
public class BStreamTableFilter {

  public static void main(String[] args) throws IOException {

    String streamTable = "tables/streamTables/West IndiesStreamTable.csv";
    BufferedReader bufferedReader = new BufferedReader(new FileReader(streamTable));

    Map<String, Integer> playerNameCountMap = new HashMap<>();

    String currentLine = null;
    while ((currentLine = bufferedReader.readLine()) != null) {

      String[] splits = currentLine.split(",");
      String playerName = splits[0];
      if (playerNameCountMap.containsKey(playerName)) {
        int count = playerNameCountMap.get(playerName);
        count++;
        playerNameCountMap.put(playerName, count);
        continue;
      }

      playerNameCountMap.put(playerName, 1);
    }
    Map<String, Integer> sortedPlayerNameCountMap = sortByValue(playerNameCountMap);
    Set<String> topTen = new HashSet<>();

    int count = 0;
    for (Map.Entry<String, Integer> stringIntegerEntry : sortedPlayerNameCountMap.entrySet()) {
      topTen.add(stringIntegerEntry.getKey());
      count++;
      if (count == 10)
        break;
    }

    String performanceTableEnhanced = "tables/filterStreamTables/WestIndiesStream.csv";
    FileWriter fileWriter = new FileWriter(performanceTableEnhanced);
    BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
    bufferedReader = new BufferedReader(new FileReader(streamTable));
    currentLine = null;
    while ((currentLine = bufferedReader.readLine()) != null) {
      String[] splits = currentLine.split(",");
      String playerName = splits[0];
      if (topTen.contains(playerName))
        bufferedWriter.write(currentLine + "\n");
    }

    bufferedWriter.close();
    bufferedReader.close();


  }

  public static <K, V extends Comparable<? super V>> Map<K, V> sortByValue(Map<K, V> map) {
    List<Map.Entry<K, V>> list = new LinkedList<Map.Entry<K, V>>(map.entrySet());
    Collections.sort(list, new Comparator<Map.Entry<K, V>>() {
      public int compare(Map.Entry<K, V> o1, Map.Entry<K, V> o2) {
        return (-1 * (o1.getValue()).compareTo(o2.getValue()));
      }
    });

    Map<K, V> result = new LinkedHashMap<K, V>();
    for (Map.Entry<K, V> entry : list) {
      result.put(entry.getKey(), entry.getValue());
    }
    return result;
  }

}
