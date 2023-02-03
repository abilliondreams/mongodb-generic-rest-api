pipeline {
    agent any
	
	environment {
					GOOGLE_APPLICATION_CREDENTIALS = 'build.json';
                    GOOGLE_PROJECT_ID = 'us108338-np-sis-df-gmkt-6822'; 
	                GOOGLE_SERVICE_ACCOUNT_KEY = credentials('gce-build-account');
	                
					imangeName = "sachinpatidar/abilliondreams:core-services-${env.BUILD_ID}"
					registryCredential = 'sachinpatidar-dockerhub'
					dockerImage = ''
                }

    stages {
        stage('Init') {
			
                steps {
                    
                   sh '''
                      echo ${GOOGLE_SERVICE_ACCOUNT_KEY} | base64 | base64 --decode >  build.json
                    '''
                  
                  sh 'cat build.json'
                  
                    
                    
				sh """				
				echo "deploy stage";
				curl -o /tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-220.0.0-linux-x86_64.tar.gz;
				tar -xvf /tmp/google-cloud-sdk.tar.gz -C /tmp/;
				/tmp/google-cloud-sdk/install.sh -q;
				source /tmp/google-cloud-sdk/path.bash.inc;
				gcloud config set project ${GOOGLE_PROJECT_ID};
				 
				 echo "After authentication gcloud";
				 gcloud config list;
				 gcloud auth activate-service-account --key-file build.json;				 				 
								 				 			
				""" 
			}
		
        }
		stage('Build') {
			
                steps{
					script {
					  dockerImage = docker.build imangeName
					}
				  }
		
        }
		stage('deploy') {
			
                steps {
                                       
				script {
						  docker.withRegistry( '', registryCredential ) {
							dockerImage.push()
					}
					sh """				
				echo "deploy istio service";
				
				kubectl label namespace default istio-injection=enabled --overwrite
				
				 kubectl apply -f ingress.yaml
				 
				 kubectl apply -f coreservices.yaml				
				 kubectl apply -f coreservices-gateway.yaml				
				 
				 kubectl set image deployments/coreservices coreservices=${imangeName}

				 kubectl create secret docker-registry registry-credential-secrets --docker-server="docker.io" --docker-email="eng.sachin@gmail.com" --docker-username="sachinpatidar" --docker-password="8bbaea11-5b3c-4256-afc2-7f086fc8c820"
				 kubectl patch serviceaccount default -p "{\"imagePullSecrets\": [{\"name\": \"registry-credential-secrets\"}]}"
								 				 			
				""" 
				}
			}
		
        }
		stage('Remove Unused docker image') {
				  steps{
				  
					sh "docker rmi $imangeName"
				  }
				}
    }
}
