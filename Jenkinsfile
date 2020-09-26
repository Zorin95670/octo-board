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
            }
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
}
