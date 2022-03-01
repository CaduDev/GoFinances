import React, { useCallback, useEffect, useState } from 'react';

import { ActivityIndicator } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { VictoryPie } from 'victory-native';

import { useTheme } from 'styled-components';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { addMonths, subMonths, format } from 'date-fns';

import { ptBR } from 'date-fns/locale';

import { RFValue } from 'react-native-responsive-fontsize';

import { useFocusEffect } from '@react-navigation/native';

import { HistoryCard } from '../../components/HistoryCard';

import { categories } from '../../utils/categories';

import { 
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MounthSelectButton,
  MounthSelectIcon,
  Mounth,
  LoadContainer,
} from './styles';

interface TransactionData {
  type: 'positive' | 'negative',
  name: string; 
  amount: string; 
  category: string; 
  date: string 
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume(){
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  function handleDateChange(action: 'next'|'prev') {
    setIsLoading(true);

    if(action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1))
    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  async function loadData() {
    const dataKey = "@gofinances:transactions";
      
    const response = await AsyncStorage.getItem(dataKey);

    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted
      .filter((expensive: TransactionData) =>
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&  
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()  
    );

    const expensivesTotal = expensives.reduce((acumullator: number, expensive: TransactionData) => {
      return acumullator + Number(expensive.amount)
    }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if(expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if(categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const percent = `${(categorySum/ expensivesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          totalFormatted,
          total: categorySum,
          percent
        });
      };
    });

    setTotalByCategories(totalByCategory);

    setIsLoading(false);
  }
  
  useFocusEffect(useCallback(() => {
    loadData()
  }, [selectedDate]));

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {console.log(useBottomTabBarHeight())}
      <Content 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: useBottomTabBarHeight(),
        }}
      >
        {isLoading ? 
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </LoadContainer>
        : (
          <>
            <MonthSelect>
              <MounthSelectButton onPress={() => handleDateChange('prev')}>
                <MounthSelectIcon name="chevron-left" />
              </MounthSelectButton>
    
              <Mounth>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Mounth>
    
              <MounthSelectButton onPress={() => handleDateChange('next')}>
                <MounthSelectIcon name="chevron-right" />
              </MounthSelectButton>
            </MonthSelect>
            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={totalByCategories.length > 1? 50: 0.1}
                x="percent"
                y="total"
              />
            </ChartContainer>
            {
              totalByCategories.map(item => (
                <HistoryCard
                  key={item.key}
                  color={item.color}
                  amount={item.totalFormatted}
                  title={item.name}
                />
              ))
            }
          </>
        )}
      </Content>
    </Container>
  );
}