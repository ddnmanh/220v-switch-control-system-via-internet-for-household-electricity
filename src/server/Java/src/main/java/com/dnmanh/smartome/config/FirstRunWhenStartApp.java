package com.dnmanh.smartome.config;

import com.dnmanh.smartome.entity.Permission;
import com.dnmanh.smartome.util.DatabaseInitializerUtil;
import com.dnmanh.smartome.util.UrlScannerUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class FirstRunWhenStartApp implements CommandLineRunner {

    private final UrlScannerUtil urlScanner;
    private final DatabaseInitializerUtil databaseInitializerUtil;

    public FirstRunWhenStartApp(
            UrlScannerUtil urlScanner,
            DatabaseInitializerUtil databaseInitializerUtil
    ) {
        this.urlScanner = urlScanner;
        this.databaseInitializerUtil = databaseInitializerUtil;
    }

    @Override
    public void run(String... args) throws Exception {

        // Print all URLs
//        this.urlScanner.print();

        ArrayList<Permission> arrPermision = this.urlScanner.getAllPermision();

        // Run the database initializer
        this.databaseInitializerUtil.run(arrPermision);

    }

}
