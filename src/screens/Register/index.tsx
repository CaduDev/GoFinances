import React, { useState } from 'react';

import { Modal } from 'react-native';

import { useForm } from 'react-hook-form';

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

interface FormData {
  name: string;
  amount: string;
}

export function Register(){
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit
  } = useForm();
  
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

    const data = {
      name,
      amount,
      transactionType,
      category: category.key,
    }

    console.log(data)
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>
      <Form>
        <Fields>
          <InputForm 
            name="name"
            control={control}
            placeholder='Nome'
          />
          <InputForm 
            name="amount"
            control={control}
            placeholder='Preço'
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
  );
}
