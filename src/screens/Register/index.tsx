import React, { useState, useEffect } from 'react';

import { Alert, Keyboard, Modal } from 'react-native';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { useForm } from 'react-hook-form';

import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import AsyncStorage from '@react-native-async-storage/async-storage';

import uuid from 'react-native-uuid';

import { InputForm } from '../../components/Forms/InputForm';

import { Button } from '../../components/Forms/Button';

import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';

import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';

export type FormData = {
  [name: string]: any;
}

type NavigationProps = {
  navigate:(screen:string) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório!'),
  amount: Yup
    .number()
    .typeError('Infome um valor númerico!')
    .positive('O valor não pode ser negativo!')
    .required('Preço é obrigatório!')
});

export function Register(){
  const navigation = useNavigation<NavigationProps>();

  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });
  
  function handleTransactionTypesSelect(type: 'positive'|'negative') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }

  async function handlerRegister(form: FormData) {
    const { name, amount } = form;

    if(!transactionType)
      return Alert.alert('Atenção', 'Selecione o tipo de transação!');

    if(category.key === 'category')
      return Alert.alert('Atenção', 'Selecione a categoria!');

    const newTransaction = {
      id: String(uuid.v4()),
      name,
      amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const dataKey = "@gofinances:transactions";
      
      // await AsyncStorage.removeItem(dataKey);

      const data = await AsyncStorage.getItem(dataKey);

      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newTransaction
      ];
      
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigation.navigate('Listagem');
    } catch(err) {
      Alert.alert("Atenção", "Não foi possivel salvar!");
    }
  }

  return (
    <TouchableWithoutFeedback 
      onPress={Keyboard.dismiss}
      containerStyle={{ flex: 1 }}
      style={{ flex: 1 }}
    >      
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm 
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm 
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionTypes>
              <TransactionTypeButton 
                type="up"
                title="Renda"
                onPress={() => handleTransactionTypesSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton 
                type="down"
                title="Resultado"
                onPress={() => handleTransactionTypesSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionTypes>
            <CategorySelectButton 
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button 
            title="Enviar"
            onPress={handleSubmit(handlerRegister)}
          />
        </Form>
        <Modal visible={categoryModalOpen} animationType="slide">
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
