import React, { useState } from 'react';

import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';

import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

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

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório!'),
  amount: Yup
    .number()
    .typeError('Infome um valor númerico!')
    .positive('O valor não pode ser negativo!')
});

export function Register(){
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  
  function handleTransactionTypesSelect(type: 'up'|'down') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }

  function handlerRegister(form: FormData) {
    const { name, amount } = form;

    if(!transactionType)
      return Alert.alert('Atenção', 'Selecione o tipo de transação!');

    if(category.key === 'category')
      return Alert.alert('Atenção', 'Selecione a categoria!');

    const data = {
      name,
      amount,
      transactionType,
      category: category.key,
    }

    console.log(data)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>      
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
                onPress={() => handleTransactionTypesSelect('up')}
                isActive={transactionType === 'up'}
              />
              <TransactionTypeButton 
                type="down"
                title="Resultado"
                onPress={() => handleTransactionTypesSelect('down')}
                isActive={transactionType === 'down'}
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
