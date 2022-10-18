pipeline {
    agent any

    stages {
        stage('Clonar o repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/Borcate/testes-api-cy.git'
            }
        }
                stage('Instalar dependendias') {
            steps {
                sh 'npm install'
            }
        }
                stage('Iniciar server') {
            steps {
                sh 'npx serverest'
            }
        }
                stage('Executar testes') {
            steps {
                sh 'NO_COLOR=1 npm run cy:run'
            }
        }
    }
}
