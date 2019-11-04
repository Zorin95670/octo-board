#!groovy

@Library("jenkins-shared-libraries")
import com.arkena.jenkins.JenkinsHelper

def jenkinsHelper = new JenkinsHelper()

Boolean isNotTriggeredByTimer = jenkinsHelper.triggeredBy() != "TIMER"
// Will we build the snapshot package or not? This is initialized to false.
Boolean SHOULD_PACKAGE = false

jenkinsHelper.prepareJob()

def runTests() {
    stage("Build") {
        sh("""
            mkdir -p target

            npm install
            npm run lint:report || true
            # bandit: Bandit is a tool designed to find common security issues in Python code, is there smth available for js?
            # npm run unit # run unit test and coverage.
            npm run test:unit || true
            # Attempt a production build
            npm run build:package
        """)
    }
}

if (env.JOB_NAME.startsWith("releasemb-")) {
    node("buster") {
        wrap([$class: "MesosSingleUseSlave"]) {
            ansiColor("xterm") {
                jenkinsHelper.checkout()
                withNPM(npmrcConfig: jenkinsHelper.NPMRC_FILE_ID) {
                    withEnv(["PATH+NODEJS_HOME=${tool 'NodeJS 10'}/bin","OPENSSL_CONF=/etc/ssl/"]) {
                        runTests()
                        jenkinsHelper.runDependencyCheck("--scan package.json --scan package-lock.json")
                        jenkinsHelper.sonarAnalysis()
                    }
                }
                stage("Publish results") {
                    jenkinsHelper.archivePublishJUNIT("**/*tests.xml")
                    step([$class: "CoberturaPublisher", autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: "**/*coverage.xml", failNoReports: false, failUnhealthy: false, failUnstable: false, maxNumberOfBuilds: 0, onlyStable: false, sourceEncoding: "ASCII", zoomCoverageChart: false])
                }
                jenkinsHelper.waitSonarQG()

                PKG_VERSION = sh(returnStdout: true, script: "echo -n \$(dpkg-parsechangelog -S Version)")
                // Decision about snapshot packaging
                if (env.BRANCH_NAME != "master") {
                    println("Skipping snapshot packaging, as it is only enabled on the master branch.")
                } else if (currentBuild.result != "SUCCESS") {
                    println("As the build FAILED, snapshot packaging will NOT be attempted.")
                } else if (!PKG_VERSION.contains("~dev")) {
                    println("As it is NOT a development version, snapshot packaging will NOT be attempted.")
                } else {
                    SHOULD_PACKAGE = true
                    stage ("Stash everything") {
                        stash(name: "workspace", useDefaultExcludes: false)
                    }
                }
            }
        }
    }
    // Snapshot packaging
    if (SHOULD_PACKAGE) {
        stretch_dsc_file = jenkinsHelper.generateDebianSourcePackage("snapshot", "stretch")
        stage('Build and publish for stretch') {
            jenkinsHelper.buildAndPublishDebianPackage(stretch_dsc_file, "stretch", ["qa-cw"])
        }
    }

} else if (currentBuild.projectName.startsWith("pr-")) {
    node("buster") {
        wrap([$class: "MesosSingleUseSlave"]) {
            ansiColor("xterm") {
                jenkinsHelper.checkout()
                withNPM(npmrcConfig: jenkinsHelper.NPMRC_FILE_ID) {
                    withEnv(["PATH+NODEJS_HOME=${tool 'NodeJS 10'}/bin","OPENSSL_CONF=/etc/ssl/"]) {
                        runTests()
                        jenkinsHelper.runDependencyCheck("--scan package.json --scan package-lock.json")
                        jenkinsHelper.sonarMergeRequestAnalysis()
                    }
                }
                stage("Publish results") {
                    jenkinsHelper.archivePublishJUNIT("**/*tests.xml")
                    step([$class: "CoberturaPublisher", autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: "**/*coverage.xml", failNoReports: false, failUnhealthy: false, failUnstable: false, maxNumberOfBuilds: 0, onlyStable: false, sourceEncoding: "ASCII", zoomCoverageChart: false])
                }
            }
        }
    }

} else if (currentBuild.projectName.startsWith("pck-")) {
    node("buster") {
        wrap([$class: "MesosSingleUseSlave"]) {
            ansiColor("xterm") {
                jenkinsHelper.checkout()
                withNPM(npmrcConfig: jenkinsHelper.NPMRC_FILE_ID) {
                    withEnv(["PATH+NODEJS_HOME=${tool 'NodeJS 10'}/bin","OPENSSL_CONF=/etc/ssl/"]) {
                        runTests()
                    }
                }
                if (currentBuild.result == null) {
                    currentBuild.result = "SUCCESS"
                }
                stage ("Stash everything") {
                    stash(name: "workspace", useDefaultExcludes: false)
                }
            }
        }
    }
    if (currentBuild.result == "SUCCESS") {
        stretch_dsc_file = jenkinsHelper.generateDebianSourcePackage("build_dsc", "stretch")
        stage('Build and publish for stretch') {
            jenkinsHelper.buildAndPublishDebianPackage(stretch_dsc_file, "stretch", ["qa-cw", "cw"])
        }
    } else {
        error("Build failed, skipping packaging.")
    }
} else if (currentBuild.projectName.startsWith("mut-")) {
// TODO
}
