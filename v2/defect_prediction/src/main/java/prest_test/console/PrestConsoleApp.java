package prest_test.console;

import java.io.File;
//import org.apache.log4j.Logger;
//import common.data.ApplicationProperties;
import prest_test.common.ApplicationProperties


public class PrestConsoleApp {

    private static PrestConsoleApp appInstance;
    private static boolean fromCommandLine = false;
    private static String[] cmdArguments;
    static Logger logger = null;

    public static void startup(String[] args) {

        if (args == null || args.length == 0)
        {
            logger.error("No arguments provided.");
        }
        else
        {
            changeWorkStyle(args);
        }

        String repository = ApplicationProperties.get("repositorylocation");
        if (repository == null) {
            logger.error("check your application.properties file no repository location selected");
        }

        if (fromCommandLine) {
            CommandLineExplorer cmdLineExplorer = new CommandLineExplorer();
            cmdLineExplorer.startExecFromCmdLine(cmdArguments);
        }
    }



    public static void changeWorkStyle(String[] args) {
        fromCommandLine = true;
        cmdArguments = args;
    }

}
