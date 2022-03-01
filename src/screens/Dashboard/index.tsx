import React, { useCallback, useEffect, useState } from 'react';

import { ActivityIndicator } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';

import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
  LoadModal,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransactions: string;
}

interface HighlightData {
  entries: HighlightProps,
  expensives: HighlightProps,
  total: HighlightProps;
}

export function Dashboard() {
  const dataKey = "@gofinances:transactions";
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  function getLastTransactionDate(collection: DataListProps[], type: 'positive'| 'negative') {
    const lastTransactions = new Date(
      Math.max.apply(Math, 
        collection
        .filter(transaction => transaction.type === type)
        .map(transaction => new Date(transaction.date).getTime())
      )
    );
    
    return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString('pt-BR', {
      month: 'long'
    })}`
  }
  
  async function loadTransactions() {
    const response = await AsyncStorage.getItem(dataKey);

    const transactions = response ? JSON.parse(response): [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
      .map((item: DataListProps) => {

        if(item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount)
          .toLocaleString('pt-BR', { 
            style: 'currency',
            currency: 'BRL'
          });
        
        const dateFormatted = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date: dateFormatted,
        }
    }); 

    const total = entriesTotal - expensiveTotal;

    const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive');

    const lastTransactionsExpensives = getLastTransactionDate(transactions, 'negative');

    const totalInterval = `01 à ${lastTransactionsExpensives}`

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: `Última entrada dia ${lastTransactionsEntries}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: `Última saída dia ${lastTransactionsExpensives}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: totalInterval
      }
    });

    setTransactions(transactionsFormatted);

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []));

  return (
    <Container>
      {
        isLoading ? 
        <LoadModal>
          <LoadContainer>
            <ActivityIndicator 
              color={theme.colors.primary} 
              size="large"
            />
          </LoadContainer>
        </LoadModal>
        :
        <>
          <Header>
            <UserWrapper>        
              <UserInfo>
                <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/54035838?v=4' }}/>
                <User>
                  <UserGreeting>Olá</UserGreeting>
                  <UserName>Carlos Eduardo</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={() => {}}>
                <Icon name="power"/>
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard 
              title="Entradas" 
              amount={highlightData.entries.amount} 
              lastTransaction={highlightData.entries.lastTransactions}
              type="up"
            />
            <HighlightCard 
              title="Saídas" 
              amount={highlightData.expensives.amount} 
              lastTransaction={highlightData.expensives.lastTransactions}
              type="down"
            />
            <HighlightCard 
              title="Total" 
              amount={highlightData.total.amount}  
              lastTransaction={highlightData.total.lastTransactions}
              type="total"
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList 
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item}/>}
            />
          </Transactions>
        </>
      }
    </Container>
  )
}