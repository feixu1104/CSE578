import java.util.Random;

/**
 * Created by nikoo28 on 4/6/17.
 */
public class HelperFunctions {

  protected static int randInt(int min, int max) {

    Random rand = new Random();
    return rand.nextInt((max - min) + 1) + min;
  }

  protected static String randomNameGenerator() {
    int nameLength = randInt(5, 8);
    StringBuilder name = new StringBuilder("");
    for (int i = 0; i < nameLength; i++) {
      char c;
      if (i == 0)
        c = (char) randInt((int) 'A', (int) 'Z');
      else
        c = (char) randInt((int) 'a', (int) 'z');
      name.append(c);
    }
    return name.toString();
  }

}
