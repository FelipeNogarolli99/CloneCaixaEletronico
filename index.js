// modulos externos 
// const inquirer = require("inquirer")
import inquirer from 'inquirer';
import chalk from 'chalk';

// modulos internos
import fs from 'fs';
import { Console, error } from 'console';

operation();




function operation(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'o que voce deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ],
    },
    ])
    .then((answer) => {
        const action = answer['action']
        if(action === 'Criar conta'){
            createAccount()

        } else if( action === "Depositar"){
            deposit()

        }else if( action === "Consultar saldo"){
            getAccountBalance()

        }else if( action === "Sacar"){
            withDraw()
            
        }else{ action === "Sair"
            console.log(chalk.bgBlue.black('Obrigado por usar o sistema!!'))   
            process.exit()
        }
    })
    .catch((error) => console.log(error))
}

function createAccount(){
    console.log(chalk.bgGreen.black('Parabens por escolher o nosso banco'))
    console.log(chalk.green('Defina as opçoes da sua conta a seguir'))
    buildAccount();
}

function buildAccount(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para sua conta',

        },
    ])
    .then((answer) => {

        const accountName = answer['accountName']

        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(
                chalk.bgRed.black("Está conta já existe, tente outro nome!!")
            )
            buildAccount();
            return;
        }

        fs.writeFileSync(`accounts/${accountName}.json` , '{"balance": 0}',
            function (err){
                console.log(err)
            },
        )

        console.log(chalk.bgGreen("Parabens a sua conta foi criada com sucesso!!"))
        operation();
    })
    .catch((error) => console.log(error))
}

function deposit(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta??'

        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount (accountName)){
            return deposit();
        }

        inquirer.prompt([
            {
                name:'amount',
                message: 'Quanto voce deseja depositar? ',
            },
        ]).then((answer) =>{
            const amount = answer['amount']

            addAmount(accountName, amount)

            operation()

        }).catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}

function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black("Está conta não existe, escolha outro nome!"))
        return false;
    }

    return true;
}

function addAmount( accountName, amount){

    const account = getAccount(accountName)
    
    if(!amount){
        console.log("Ocorrer um erro tente novamente")
        return deposit();
    }

    account.balance = parseFloat(amount) + parseFloat (account.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(account),
        function (err){
            console.log(err)
        },

    )

    console.log(chalk.green(`foi depositado o valor R$${amount} na sua conta`))
    
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
        
    })

    return JSON.parse(accountJSON)
}

function getAccountBalance(){
    inquirer.prompt([
        {
            name:'accountName',
            message: 'Qual é o nome da sua conta? ',
        }
    ]).then((answer) =>{
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const account = getAccount(accountName)

        console.log(chalk.bgBlue.black(`Ola o seu saldo é de R$${account.balance}`))
        operation()

    }).catch((error) => console.log(error))
}

function withDraw(){

    inquirer.prompt([
        {
            name:'accountName',
            message: 'Qual é o nome da sua conta? ',
        }
    ]).then((answer) =>{
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return withDraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: '  Quanto vc desseja sacar? '
            }
        ]).then((answer) =>{
            const amount = answer['amount']
    
         removeAmount(accountName, amount)
         
    
        }).catch((error) => console.log(error))


    }).catch((error) => console.log(error))
    
}

function removeAmount(accountName, amount){
    const account = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black("ocorreu um erro tente novamnte mais tarde"))
        return withDraw()
    }

    if(account.balance < amount ){
        console.log(chalk.bgRed.black("Valor indisponivel para saque"))
        return withDraw()
    }

    account.balance = parseFloat(account.balance) - parseFloat (amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(account),
        function(err){
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi realizado um sace de R% ${amount} da sua conta!`))
    operation();
}