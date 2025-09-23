<template>
  <el-form ref="filterFormRef" label-width="95px" label-position="left">
    <el-form-item
      v-for="item in filterFormHead"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
    >
      <el-select
        v-if="
          item.prop == 'assetCode' ||
          item.prop == 'name' ||
          item.prop == 'model' ||
          item.prop == 'snNumber' ||
          item.prop == 'unit' ||
          item.prop == 'money'
        "
        v-model="filterForm[item.index].handle"
        style="width: 120px"
        placeholder="请选择条件"
        clearable
        filterable
      >
        <el-option
          v-for="item in filterCondtionData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        style="margin-left: 5px; width: 224px"
        v-if="
          item.prop == 'assetCode' ||
          item.prop == 'name' ||
          item.prop == 'model' ||
          item.prop == 'snNumber' ||
          item.prop == 'unit' ||
          item.prop == 'money'
        "
        v-model="filterForm[item.index].value"
        :placeholder="'请输入' + item.label"
      ></el-input>
      <el-select
        v-if="item.prop == 'state'"
        v-model="filterForm[item.index].value"
        multiple
        placeholder="请选择"
        clearable
        filterable
        collapse-tags
      >
        <el-option
          v-for="item in stateListData"
          :key="item._id"
          :label="item.label"
          :value="item._id"
        ></el-option>
      </el-select>
      <el-select
        v-if="item.prop == 'source'"
        v-model="filterForm[item.index].value"
        multiple
        placeholder="请选择"
        clearable
        filterable
        collapse-tags
      >
        <el-option
          v-for="item in sourceListData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <ds-select-tree
        v-if="item.prop == 'deptId'"
        v-model="filterForm[item.index].value"
        placeholder="请选择部门"
        :treeData="deptTreeData"
        :defaultProps="{
          children: 'children',
          label: 'deptName',
          value: '_id',
        }"
        :checkStrictly="true"
        :multiple="true"
        collapseTags
      >
      </ds-select-tree>
      <ds-select-tree
        v-if="item.prop == 'classifyId'"
        v-model="filterForm[item.index].value"
        placeholder="请选择分类"
        :treeData="assetTypeData"
        :defaultProps="{
          children: 'children',
          label: 'classifyName',
          value: '_id',
        }"
        :collapseTags="true"
        :checkStrictly="true"
        :multiple="true"
      >
      </ds-select-tree>
      <el-date-picker
        v-if="item.prop == 'inData' || item.prop == 'useDate'"
        value-format="yyyy-MM-dd"
        v-model="filterForm[item.index].value"
        type="daterange"
        :range-separator="$t('h.to')"
        :start-placeholder="$t('h.startDate')"
        :end-placeholder="$t('h.endDate')"
      >
        <!-- format="yyyy 年 MM 月 dd 日" -->
      </el-date-picker>
      <el-select
        v-if="item.prop == 'goodsId'"
        v-model="filterForm[item.index].value"
        multiple
        placeholder="请选择"
        clearable
        filterable
      >
        <el-option
          v-for="(item, i) in assetAttrData"
          :key="i"
          :label="item.name"
          :value="item.goodsqId"
        >
        </el-option>
      </el-select>
      <el-select
        v-if="item.prop == 'warehouseId'"
        ref="filterWareSelectRef"
        v-model="filterForm[item.index].value"
        multiple
        placeholder="请选择"
        clearable
        filterable
        :filter-method="() => {}"
        v-load-more="{
          options: assetAreaData,
          modelField: '_id',
          searchField: 'andLike',
          func: 'S0003',
          userInfo: userInfo,
        }"
      >
        <!-- model: filterForm[item.index].value, -->
        <el-option
          v-for="item in assetAreaData"
          :key="item._id"
          :label="item.warehouseName"
          :value="item._id"
        >
          <span>{{ item.code }} - {{ item.warehouseName }}</span>
        </el-option>
      </el-select>
      <el-select
        v-if="item.prop == 'responsibleId' || item.prop == 'staffId'"
        :ref="'filter' + item.prop + 'SelectRef'"
        v-model="filterForm[item.index].value"
        placeholder="请选择"
        clearable
        multiple
        filterable
        :filter-method="() => {}"
        v-load-more="{
          options: staffData,
          modelField: '_id',
          searchField: 'andLike',
          func: 'S0005',
          userInfo: userInfo,
        }"
      >
        <!-- model: filterForm[item.index].value, -->
        <el-option
          v-for="item in staffData"
          :key="item._id"
          :label="item.name"
          :value="item._id"
        >
          <span
            >{{ item.name + "(" + item.code + ")" }} -{{ item.deptName }}</span
          >
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
